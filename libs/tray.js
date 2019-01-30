const { Tray, Menu } = require('electron')
const path = require('path')

var trayModule = []
var tray
var contextMenu;




trayModule.init = function (app, cb) {
    var iconPath = path.join(__dirname, '../icons/');
    if (process.platform === "win32") {
        iconPath = path.join(iconPath, "windows/tray.ico");
    } else if (process.platform === "linux") {
        iconPath = path.join(iconPath, "linux/tray/64x64.png");
    } else {
        iconPath = path.join(iconPath, "mac/tray.png");
    }
    tray = new Tray(iconPath)
    
    contextMenu = Menu.buildFromTemplate([
        { label: "Mostrar", click: cb },
        { label: 'Sair', click: app.quit },
    ])
    tray.setContextMenu(contextMenu)


    return tray
}
trayModule.get = () => {
    return tray
}

module.exports = exports = trayModule;