
if (typeof com == "undefined") {
    com = {};
} else if (typeof com != 'object') {
    throw new Error("com already exists and is not an object.");
}
if (!com.geovanems) {
    com.geovanems = {};
} else if (typeof org.example != 'object') {
    throw new Error("com.geovanems already exists and is not an object.");
}

window.addEventListener("DOMContentLoaded", function (event) {
    com.geovanems.load();
});

com.geovanems.InputError = function (el) {
    if (el.tagName === "INPUT") {
        el = el.parentElement;
    }
    el.classList.add('igs-error');
};

com.geovanems.load = function () {
    function switchsLoad() {
        function switchToggle(){
            this.classList.toggle("igs-active");
        }
        let switchs = document.getElementsByClassName('igs-switch');
        Array.prototype.forEach.call(switchs, element => {

            
            let circle = document.createElement("div");
            circle.classList.add('igs-switch-circle')
            
            element.appendChild(circle);

            element.addEventListener("click", switchToggle);
        });

    }
    function selectsLoad() {
        let selectActive;
        function getParentSelect(element){
            let parent = element;
            while (parent != document.body){
                if(parent.classList.contains("igs-select")){
                    return parent;
                }else{
                    parent = parent.parentNode;
                }
            }
            return false;
        }
        function selectClick(e){
            if(!this.classList.contains("igs-select-show")){
                let position = this.getClientRects()[0]
                this.style.left = position.left + "px";
                this.style.top = position.top + "px";
                this.classList.add("igs-select-show")
                selectActive = this;

            } else if(e.srcElement.tagName == "OPTION" || e.srcElement.tagName == "SPAN"){
                let option = e.srcElement;
                this.querySelector("span").innerHTML = option.innerHTML
                let options = this.querySelectorAll("option");
                Array.prototype.forEach.call(options, element => {
                    element.classList.remove("igs-active")
                })
                option.classList.add("igs-active")
                this.classList.remove("igs-select-show")
            }
        }
        function selectBlur(e){
            if(selectActive && getParentSelect(e.srcElement) !== selectActive){
                selectActive.classList.remove("igs-select-show")

            }
        }
        let selects = document.getElementsByClassName('igs-select');
        Array.prototype.forEach.call(selects, element => {
            let active = element.querySelector("option.igs-active");
            let span = document.createElement("span");
            if(active){
                span.innerHTML = active.innerHTML;
            }else{
                span.innerHTML = element.firstChild;
            }
            element.insertBefore(span, element.firstChild);
            element.addEventListener("click", selectClick)
            window.addEventListener("click", selectBlur)
            
    
        });

    }
    function headerLoad() {
        function headerHover() {
            let header = document.getElementsByClassName('igs-header');
            let position = document.body.scrollTop;
            for (var i = 0; i < header.length; i++) {
                if (header[i].offsetHeight < position) {
                    header[i].classList.add('igs-active');
                } else if (position == 0) {
                    header[i].classList.remove('igs-active');
                }

            }
        }
        document.addEventListener("scroll", headerHover);
    }
    function inputsLoad() {
        function inputFocus() {
            console.log(123)
            this.classList.add('igs-focus');
            this.querySelector('input').focus()
        }
        function inputBlur() {
            this.parentElement.classList.remove('igs-focus');
            if (this.value !== "") {
                this.parentElement.classList.add('igs-haveValue');
            } else {
                this.parentElement.classList.remove('igs-haveValue');

            }
        }
        function inputKeyup() {
            if (event.key == "Enter") {
                let inputs = document.getElementsByClassName('igs-input');
                let parent = event.srcElement.parentElement;
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i] === parent) {
                        if (i !== inputs.length - 1) {
                            inputs[i + 1].querySelector('input').focus();
                            break;
                        } else {
                            inputs[i].querySelector('input').blur();
                        }
                    }
                }
            }
        }
        function inputChange() {
            var parent = event.srcElement.parentElement;
            parent.classList.remove('igs-error');
        }

        var elements = document.getElementsByClassName('igs-input');
        Array.prototype.forEach.call(elements, element => {
            var span = element.querySelector('span');
            span.classList.add("igs-input-label")
            var input = element.querySelector('input');
            element.addEventListener("click", inputFocus);
            input.addEventListener("blur", inputBlur);
            input.addEventListener("keyup", inputKeyup);
            input.addEventListener("input", inputChange);
            var line = document.createElement("line");
            element.appendChild(line);
        });
    }
    switchsLoad();
    inputsLoad();
    selectsLoad();
    headerLoad();
}

/* 
var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'Styles/light.css';
link.media = 'all';
head.appendChild(link); */