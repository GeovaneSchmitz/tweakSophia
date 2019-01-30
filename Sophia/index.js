

const { BrowserWindow } = require('electron')
const fs = require('fs');
const onEvent = require('./libs/onEvent.js')
const task = require('./libs/task.js')
const path = require('path')
const uuid = require('uuid/v4')


const _eventName = Symbol('eventName');
const _createWin = Symbol('createWin');
const _exec = Symbol('exec');
const _baseURL = Symbol('baseURL');
const _timeout = Symbol('timeout');
const _settings = Symbol('settings');
const _user = Symbol('user');
const _userName = Symbol('userName');
const _updateUser = Symbol('updateUser');
const _pass = Symbol('pass');
const _win = Symbol('win');
const _RendererData = Symbol('RendererData');
const _updateRendererData = Symbol('updateRendererData');

"use strict";

class Sophia {
  constructor(param) {
    this[_RendererData] = {};

    if (param.timeout == undefined) {
      param.timeout = 60000
    }
    if (param.timeout != undefined) {
      this.eventName = param.eventName
    }
    if (param.user != undefined) {
      this.user = param.user
    }
    if (param.pass != undefined) {
      this.pass = param.pass
    }
    if (param.settings == undefined) {
      param.settings = { renewalStatus: false, renewalDays: 3 }
    }
    this.baseURL = param.url;
    this.timeout = param.timeout;
    this.settings = param.settings;
  }
  get eventName() {
    return this[_eventName]
  }
  set eventName(data) {
    this[_eventName] = data
  }
  get baseURL() {
    return this[_baseURL];
    
  }
  set baseURL(data) {
    this[_baseURL] = data;
    this[_updateUser] = true

  }
  get timeout() {
    return this[_timeout];
  }
  set timeout(data) {
    this[_timeout] = data;
  }
  set settings(data) {
    this[_settings] = data
  }
  get settings() {
    return this[_settings];
  }
  set pass(data) {
    this[_pass] = data
    this[_updateUser] = true
  }
  get pass() {
    return this[_pass];
  }
  set user(data) {
    this[_user] = data
    this[_updateUser] = true

  }
  get user() {
    return this[_user];
  }
  get userName() {
    return this[_userName];
  }
  [_exec](command) {
    if (this[_win] != undefined) {
      let id = uuid()
      this[_win].webContents.send(command, id);
      return id;
    } else {
      return false
    }
  }
  [_updateRendererData]() {
    this[_win].webContents.executeJavaScript("window.sophiaData="+ JSON.stringify(this[_RendererData]));
  }

  [_createWin]() {
    this[_win] = new BrowserWindow({
      width: 1024,
      height: 600,
      show: false,

      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'libs/preload.js')
      }
    })
    this[_win].loadURL(this.baseURL)
    //this[_win].webContents.openDevTools()
    var self = this
    this[_win].webContents.on("did-fail-load", function() {
      self[_win].loadURL(self.baseURL)
      self[_win].reload()
    });
   this[_win].on('uncaughtException', function (err) {
      console.log(err);
    })


  }

  event(event, data) {
    onEvent.event(data[0], event, data[1])
  }

  init() {
    let self = this
    return new Promise(function (res, rej) {
      if (self.baseURL == undefined) {
        new Error("baseURL is missing")
      } else if (!(self[_win])) {
        self[_createWin]()
        self[_RendererData].eventName = self.eventName;
        self[_RendererData].settings = self.settings;
        self[_updateRendererData]()
        task.add(self.timeout)
        onEvent.once('load', res)
        task.onFinish(function () {
          self[_win].close();
          self[_win] = undefined;
        })
      } else {
        res()
      }
    })

  }

  login(user, pass) {
    if (!user) {
      user = this.user
    } else {
      this.user = user
    }
    if (!pass) {
      pass = this.pass
    } else {
      this.pass = pass
    }
    let self = this

    return new Promise(function (resolve, reject) {
      self.init()
        .then(function () {
          self[_RendererData].user = user;
          self[_RendererData].pass = pass;
          self[_updateRendererData]();
          var id = self[_exec]('login')
          if (id) {
            onEvent.once(id, function (event, data) {
              resolve(data)
            })
            task.add(self.timeout)
            setTimeout(function () {
              if (onEvent.exist(id)) {
                reject('timeout')
              }

            }, self.timeout)
          } else {
            reject('error')
          }

        })
        .catch(function () { })

    })
  }

  bookRenewal() {
    var self = this
    function loop() {
      if(self.user && self.pass && self.settings.renewalStatus && self[_updateUser]){
        self.init().then(function(){
          task.add(self.timeout)
          onEvent.once(self[_exec]('isLogged'), function (event, isLogged) {
            if (isLogged) {
              task.add(self.timeout)
              onEvent.once(self[_exec]('bookRenewal'), function (event, data) {
                if (data) {
                  console.log('livros Renovados')
                }
              })
            } else {
              self.login().then(function (data) {
                if(data[0]){
                  task.add(self.timeout)
                  onEvent.once(self[_exec]('bookRenewal'), function (event, data) {
                    if (data) {
                      console.log('livros Renovados')
                    }
                  })  
                }else{
                  self[_updateUser] = false
                }
              })
              .catch(function () { })
            }
          })
        })
      }
    }
    loop()
    setInterval(loop, 3600000)
  }
}

module.exports = exports = Sophia;