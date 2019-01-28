const { ipcRenderer } = require('electron')
window.addEventListener("DOMContentLoaded", function (event) {
    let switchRenewal = document.getElementById("switch-renewal")
    let switchAutolaunch = document.getElementById("switch-autolaunch")
    let switchTheme = document.getElementById("switch-theme")
    let selectDays = document.getElementById("select-days")
    let daysRenewal = document.getElementById("days-renewal")

    let btnAdvanced = document.getElementById("btn-advanced")
    let contentAdvanced = document.getElementById("content-advanced")
    let inputURL = document.getElementById("input-url")
    let inputUser = document.getElementById("input-user")
    let inputPass = document.getElementById("input-pass")
    
    
    
    
    let url = ipcRenderer.sendSync('get-url', null);
    let user = ipcRenderer.sendSync('get-user', null);
    let pass = ipcRenderer.sendSync('get-pass', null);
    
    inputURL.value = url;
    inputUser.value = user;
    inputPass.value = pass;
    if(user !== ""){
        inputUser.parentElement.classList.add("igs-haveValue")
    }

    if(pass !== ""){
        inputPass.parentElement.classList.add("igs-haveValue")
    }



    let settings = ipcRenderer.sendSync('get-settings', null);
    
    if(settings.autoLaunch){
        switchAutolaunch.classList.add("igs-active");
    }else{
        switchAutolaunch.classList.remove("igs-active");
    }
    if(settings.themeDark){
        switchTheme.classList.add("igs-active");

        document.getElementById('theme-dark').disabled = false
        document.getElementById('theme-light').disabled = true
    }else{
        document.getElementById('theme-dark').disabled = true
        document.getElementById('theme-light').disabled = false
        switchTheme.classList.remove("igs-active");

    }
    if(settings.renewalStatus){
        switchRenewal.classList.add("igs-active");
        daysRenewal.classList.remove("days-renewal-close")
    }else{
        switchRenewal.classList.remove("igs-active");
        daysRenewal.classList.add("days-renewal-close")

    }
    inputUser.focus()
    inputUser.parentElement.classList.add("igs-focus")
    function optionClick(){
        settings.renewalDays = this.value;
        ipcRenderer.send('set-settings', settings);
    }
    var selectDaysOptions = selectDays.querySelectorAll('option')
    Array.prototype.forEach.call(selectDaysOptions, option => {
        option.classList.remove('igs-active')
        option.addEventListener('click', optionClick)
    });
    var option = selectDays.querySelector("option[value=\""+settings.renewalDays+"\"");
    option.classList.add('igs-active')
 
    
    switchRenewal.addEventListener("click", function(){
        let status = !this.classList.contains("igs-active");
        settings.renewalStatus = status;
        ipcRenderer.send('set-settings', settings);
        if(status){
            daysRenewal.classList.remove("days-renewal-close")
        }else{
            daysRenewal.classList.add("days-renewal-close")
        }
    })
    
    switchAutolaunch.addEventListener("click", function(){
        let status = !this.classList.contains("igs-active");
        settings.autoLaunch = status;
        ipcRenderer.send('set-settings', settings);
    })
    switchTheme.addEventListener("click", function(){
        let status = !this.classList.contains("igs-active");
        settings.themeDark = status;
        ipcRenderer.send('set-settings', settings);
        if(status){
            document.getElementById('theme-dark').disabled = false
            document.getElementById('theme-light').disabled = true
        }else{
            document.getElementById('theme-dark').disabled = true
            document.getElementById('theme-light').disabled = false
        }
    })
    inputPass.addEventListener("keyup", function(event){
        if (event.key == "Enter" && !contentAdvanced.classList.contains("content-advanced-show")) {
            login()
        }
    })
    inputURL.addEventListener("keyup", function(event){
        if (event.key == "Enter") {
            login()
        }
    })
    
    btnAdvanced.addEventListener("click", function(){
        contentAdvanced.classList.toggle("content-advanced-show")
    })

    ipcRenderer.on('account-result', function(e, data) {
        if(data[0]){
            let username = data[1].substring(0, data[1].indexOf(" "));
            username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
            document.getElementById("username").innerHTML = username;
            document.getElementById("contend-login").classList.add('content-login-disable');

        }else{
            inputUser.parentNode.classList.add('igs-error');
            inputPass.parentNode.classList.add('igs-error');
            inputURL.parentNode.classList.add('igs-error');
            document.getElementById("contend-login").classList.remove('content-login-disable');
        }
        btnLogin.addEventListener("click", login)
        btnLogin.classList.remove("btn-login-loading")

    })
    
    function login(){
            let error = false;
            if(inputUser.value == ""){
                inputUser.parentNode.classList.add('igs-error');
                error = true;
            }
            if(inputPass.value == ""){
                inputPass.parentNode.classList.add('igs-error');
                error = true;
            }
            if(inputURL.value == ""){
                inputURL.parentNode.classList.add('igs-error');
                error = true;
            }
            if(!error){
                btnLogin.removeEventListener("click", login)
                btnLogin.classList.add("btn-login-loading")

                ipcRenderer.send('login', { user:inputUser.value, pass: inputPass.value, url:inputURL.value})
            }
        
    }
    let btnLogin = document.getElementById("btn-login");
    btnLogin.addEventListener("click", login)
});

