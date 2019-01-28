const { ipcRenderer } = require('electron');
function sendData(name, data) {
    ipcRenderer.send(window.sophiaData['eventName'], [name, data])
}
window.alert = function (data) { console.log(data) }
function isLoaded(frame, check) {

    return new Promise(function (res) {

        function timeout() {
            if (frame.contentWindow[check] !== undefined) {
                res()
            } else {
                setTimeout(timeout, 100)
                return;
            }

        }
        timeout()
    })

}
let frame;
window.addEventListener("DOMContentLoaded", function (event) {
    frame = document.getElementById("mainFrame")
    frame.contentWindow.alert = function (data) { console.log(data) }
    isLoaded(frame, "LinkMensagens").then(function () {
        sendData('load')
    }).catch(function () { })

})
ipcRenderer.on("login",function(e, id){
    login().then(function(data){
        sendData(id, data)
    })
    .catch(function(){

    })
})
ipcRenderer.on("bookRenewal",function(e, id){

    bookRenewal().then(function(data){
        sendData(id, data)
    })
    .catch(function(data){
        sendData(id, data)

    })
})

ipcRenderer.on("isLogged",function(e,  id){

    isLogged().then(function(data){
        sendData(id, data)
    })
    .catch(function(){
    })
})



isLogged = function () {
    frame.contentDocument.location.reload()
    return new Promise(function (res) {
        isLoaded(frame, "LinkMensagens").then(function () {
            if (frame.contentDocument.frm_geral.querySelector('.area_login_menu_principal').firstChild.lastChild.innerHTML) {
                res(true)
            } else {
                res(false)
            }
        }).catch(function () { })


    })


}
function login() {
    return new Promise((resolve, reject) => {
        frame.contentWindow.LinkLogin();
        function TimeOut() {
        var popupFrame = frame.contentDocument.getElementById('popup-frame')
        if (popupFrame && popupFrame.contentDocument.login) {

            popupFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-popups allow-top-navigation');
            popupFrame.contentDocument.login.codigo.value = window.sophiaData.user;
            popupFrame.contentDocument.login.senha.value = window.sophiaData.pass;
            popupFrame.contentDocument.login.submit();
            function check() {
                if (popupFrame.contentDocument.login && popupFrame.contentDocument.location.href.includes('tentativa')) {

                    frame.contentWindow.fechaPopup()
                    setTimeout(function(){
                        isLoaded(frame, "LinkMensagens").then(function () {
                            resolve([false])
                        })
                    },2000)
                } else if ((popupFrame.contentDocument.login == undefined) && popupFrame.contentDocument.querySelector('div.formLogin')) {

                    let user = popupFrame.contentDocument.getElementsByTagName('DIV')[0].firstElementChild.children[1].firstElementChild.innerText                    
                    frame.contentWindow.fechaPopup()
                    setTimeout(function(){
                        isLoaded(frame, "LinkMensagens").then(function () {
                            resolve([true, user])
                        })
                    },2000)
                    
                } else {

                    setTimeout(check, 100);
                    return;
                }
            }
            check()
        } else {
            frame.contentWindow.LinkLogin();

            setTimeout(TimeOut, 5000);
            return;
        }
    }

    setTimeout(TimeOut, 3000);
});
    
}
function bookRenewal() {
    return new Promise(function(resolve,reject){
        isLogged().then(function(logged){
            if(logged){
                frame.contentWindow.LinkCirculacoes(hiddenFrame.modo_busca);
                setTimeout(function(){
                    isLoaded(frame, "LinkMensagens").then(function () {
                        var form = frame.contentDocument.frmCircula
                        let table = form.querySelector(".tab_circulacoes")
                        let tbody = table.firstElementChild
                        tbody.firstChild.remove()
                        let hasRenewal = false;
                        let date = new Date()
        
                        let nowYear = date.getFullYear();
                        let nowMonth = date.getMonth();
                        let nowDays = date.getDay();
                        let nowDate = new Date(nowYear, nowMonth, nowDays)
    
                        Array.prototype.forEach.call(tbody.children, tr => {
                            tr.firstChild.remove()
                            let arrayDate = tr.lastChild.lastChild.innerHTML.split('/')
                            arrayDate[2] = arrayDate[2].substring(0, 2)
    
                            arrayDate = arrayDate.map(function (x) {
                                return parseInt(x, 10);
                            });
    
                            var expirationDate = new Date(2000 + arrayDate[2], arrayDate[1] - 1, arrayDate[0]).valueOf() - (86400000 * window.sophiaData.settings.renewalDays)  // 86400000 == 1000x60x60x24 one day in milliseconds
    
                            if (nowDate >= expirationDate) {
                                hasRenewal = true;
                                tr.firstChild.firstChild.checked = true
                            }
                        })
                        if (hasRenewal) {
                            frame.contentWindow.LinkRenovar();
                            setTimeout(function(){
    
                                isLoaded(frame,"LinkRenovar").then(function(){
                                    resolve(true)
                                }).catch(function(){})
                            },2000)
    
                        } else {
                            resolve(false)
                        }
            
                    }).catch(function(){})
                },2000)

            
            }else{
                reject('login')
            }
        })
        .catch(function(){})
    })    
}
