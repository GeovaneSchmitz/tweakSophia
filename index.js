const { app, BrowserWindow, ipcMain } = require('electron')
const tray = require('./libs/tray')
const Sophia = require("./libs/sophia")
const Store = require('./libs/store')
const path = require('path')
const autorun = require('./libs/autorun')
autorun.init()
let mainWindow;

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', createWin)
}

const store = new Store({
    configName: 'user-preferences',
    defaults: {
        windowBounds: { width: 800, height: 600 },
        Sophia: { url: "http://biblioteca.ifsc.edu.br" },
        settings: { renewalStatus: true, renewalDays: 3, autoLaunch: false, themeDark: false }
    }
});

let sophiaData = store.get('Sophia')
sophiaData.settings = store.get('settings')
autorun.set(store.get('settings').autoLaunch)
sophiaData.eventName = "Sophia"
const sophia = new Sophia(sophiaData);
ipcMain.on(sophia.eventName, sophia.event)
app.on('ready', function () {
    if (autorun.isAutorun()) {
        if (!store.get('settings').autoLaunch) {
            app.quit()
            return;
        }
    } else {
        createWin()
    }
    tray.init(app, createWin)
    sophia.bookRenewal()
})



function createWin() {
    if (!mainWindow) {
        let { width, height } = store.get('windowBounds');
        let { themeDark } = store.get('settings');
        var iconPath = path.join(__dirname, '../icons/');
        if (process.platform === "win32") {
            iconPath = path.join(iconPath, "windows/app.ico");
        } else if (process.platform === "linux") {
            iconPath = path.join(iconPath, "linux/256x256.png");
        } else {
            iconPath = path.join(iconPath, "mac/app.png");
        }

        mainWindow = new BrowserWindow({
            icon: iconPath,
            width: width, height: height,
            backgroundColor: themeDark ? "#383838" : "#fff",
            webPreferences: {
                nodeIntegration: true,
            }
        })
        //mainWindow.webContents.openDevTools()

        mainWindow.setMenu(null);
        mainWindow.on('resize', () => {
            let { width, height } = mainWindow.getBounds();
            store.set('windowBounds', { width, height });
        });

        mainWindow.loadFile('renderer/index.html')

        mainWindow.on('closed', () => {

            mainWindow = null
        })
    } else {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
}
ipcMain.on('get-url', function (event, data) {
    event.returnValue = store.get('Sophia').url;
})
ipcMain.on('get-user', function (event, data) {
    let user = store.get('Sophia').user;
    if (user == undefined) {
        user = "";
    }
    event.returnValue = user;
})

ipcMain.on('get-pass', function (event, data) {
    let pass = store.get('Sophia').pass;
    if (pass == undefined) {
        pass = "";
    }
    event.returnValue = pass;
})
ipcMain.on('get-settings', function (event, data) {
    event.returnValue = store.get('settings');
})
ipcMain.on('set-settings', function (event, data) {
    autorun.set(data.autoLaunch);
    store.set('settings', data);
    sophia.settings = data;
})
ipcMain.on('login', function (event, account) {
    sophia.baseURL = account.url;
    if (account.user == sophia.user && account.pass == sophia.pass) {
        mainWindow.webContents.send('account-result', [true, store.get("Sophia").userName])
    }
    sophia.login(account.user, account.pass).then(function (data) {
        if (data[0]) {
            account.userName = data[1]
            store.set("Sophia", account);

        } else {
            delete account.pass;
            delete account.user;
            delete account.userName;
            store.set("Sophia", account);

        }
        mainWindow.webContents.send('account-result', data);
    }).catch(function () { });
});



app.on('window-all-closed', () => {
    if (!(store.get('settings').renewalStatus)) {
        app.quit()
    }
});
