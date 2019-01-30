# Tweak Sophia
Um aplicativo para renovar os livros automaticamente do sistema [SophiA](https://www.sophia.com.br/)
 
DISCLAIMER
==========
Este aplicativo não é oficial. Ele não é apoiado por SophiA.
 
## Recursos
* Renova automaticamente livros, sob demanda, faltando X dias para a data de entrega. Você pode escolher entre 1, 3, 5, 10 dias.
* Verifica os livros a cada 1h 
* Inicia automaticamente com o computador
* Ícone na tray do sistema
* Tema escuro

## Download
[Releases](https://github.com/GeovaneSchmitz/tweakSophia/releases)

##  Building binaries
* Dependências `npm` e `nodejs`
* dependencies `npm` and `nodejs`

### Linux
* Snap e AppImage não funciona a inicialização
* O pacote ficará em dist/
* Snap and AppImage not work startup
* The package file will be written to the dist/

#### .deb (Ubuntu, Debian, Elementary OS, Linux Mint, Deepin)

```
npm install
$(npm bin)/electron-builder --linux deb
```

#### .rpm (Fedora, openSUSE, RHEL)

```
npm install
$(npm bin)/electron-builder --linux rpm
```

#### Pacman (Arch Linux, Manjaro)

```
npm install
$(npm bin)/electron-builder --linux pacman
```

### Windows

```
npm install
$(npm bin)/electron-builder --windows 
```
* O instalador ficará em dist/
* The installer file will be written to the dist/
## Screenshot
<img src="https://github.com/GeovaneSchmitz/tweakSophia/blob/master/screenshot.png"  width="60%">
