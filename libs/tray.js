const { Tray, Menu } = require('electron')
const path = require('path')
const autorun = require('./autorun')

var trayModule = []
var tray
var contextMenu;




trayModule.init = function(app, cb){
    let ext = (process.platform === "win32")? ".ico":".png";
    let icon = (process.platform === "linux")? "tray@5x":"tray";

    tray = new Tray(path.join(__dirname, '../icons/' + icon + ext))

    contextMenu = Menu.buildFromTemplate([
        { label: "Mostrar", click:cb},
        { label: 'Sair', click:app.quit},
    ])
    tray.setContextMenu(contextMenu)

  
    return tray
} 
trayModule.get = () =>{
    return tray
}

module.exports = exports = trayModule;