const path = require('path')
var AutoLaunch = require('auto-launch');
var autolauncher;
let auto = []
auto.isAutorun = function(app) {
    if(process.argv.indexOf("--hidden") > -1){
        return true
    }else{
        return false
    }

} 
auto.init = function(){
    autolauncher = new AutoLaunch({
        name: 'Sophia',
        isHidden:true
    });
}
auto.set = function(state){
    if(state){
        autolauncher.enable()
    }else{
        autolauncher.disable()
    }
}
module.exports = exports = auto;