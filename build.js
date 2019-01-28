const packager = require('electron-packager')
const { serialHooks } = require('electron-packager/hooks')
const electronInstaller = require('electron-winstaller');
const path = require("path");
packager({
    overwrite:true,
    platform:"win32",
    dir:__dirname,
    out:path.join(__dirname, "build")
}).then((buildPath)=>{
    if(process.platform === "win32" || true){
        electronInstaller.createWindowsInstaller({
            appDirectory: buildPath[0],
            outputDirectory: path.join(__dirname, 'build')
        }).then(() =>{

        },
        (e) => console.log(e));
    }
})