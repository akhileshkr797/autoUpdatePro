const electron = require('electron')
const { app, BrowserWindow, webContents } = electron
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1300,
        height: 800,
        title: 'autoUpdate'
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('close', function() {
        mainWindow = null
    })
}

app.on('ready', () => {
    createWindow()
})


//auto updater

const autoUpdater = electron.autoUpdater

autoUpdater.addListener("update-available", function(event) {
    console.log('Update Available')
})

autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName,
    releaseDate, updateURL) {
    console.log("Update Downloaded")
    console.log('releaseNotes', releaseNotes)
    console.log('releaseNotes', releaseName)
    console.log('releaseNotes', releaseDate)
    console.log('releaseNotes', updateURL)
})
autoUpdater.addListener("error", function(error) {
    console.log(Error, error)
})
autoUpdater.addListener("checking-for-update", function(event) {
    console.log('releaseNotes', 'Checking for Update')
})
autoUpdater.addListener("update-not-available", function(event) {
    console.log('releaseNotes', 'Update Not Available')
})


//auto-update check

let appVersion = app.getVersion()
let updateUrl = 'https://apress-electron-manager.herokuapp.com/updates/latest?v=' + appVersion
if (process.platform === 'darwin') {
    autoUpdater.setFeedURL(updateUrl)
    autoUpdater.checkForUpdates()
}


//user feedback

const dialog = electron.dialog
autoUpdater.addListener("update-available", function(event) {
    console.log('Update Available')
    dialog.showMessageBox({
        type: "info",
        title: "Update Available",
        message: 'There is an update available.' + appVersion,
        buttons: ["Update", "Skip"]
    }, function(index) {
        console.log(index)
    })
})
autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName,
    releaseDate, updateURL) {
    console.log('releaseNotes', "Update Downloaded")
    console.log('releaseNotes', releaseNotes)
    console.log('releaseNotes', releaseName)
    console.log('releaseNotes', releaseDate)
    console.log('releaseNotes', updateURL)
    dialog.showMessageBox({
        type: "info",
        title: "Update Downloaded",
        message: "Update has downloaded",
        detail: releaseNotes,
        buttons: ["Install", "Skip"]
    }, function(index) {
        if (index === 0) {
            autoUpdater.quitAndInstall()
        }
        autoUpdater.quitAndInstall()
    })
})
autoUpdater.addListener("error", function(error) {
    console.log('Error')
    console.log(error)
    dialog.showMessageBox({
        type: "warning",
        title: "Update Error",
        message: 'An error occurred. ' + error,
        buttons: ["OK"]
    })
})

autoUpdater.addListener("checking-for-update", function(event) {
    console.log('releaseNotes', 'Checking for Update')
})
autoUpdater.addListener("update-not-available", function(event) {
    console.log('releaseNotes', 'Update Not Available')
    dialog.showMessageBox({
        type: "warning",
        title: "No Updates",
        message: 'No update available at this time.',
        buttons: ["OK"]
    })
})