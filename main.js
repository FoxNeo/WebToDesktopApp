// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
require('dotenv').config()

// Loads target URL
const URL = process.env.URL ;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: `${__dirname}/renderer.js`
    }
  });

  // npm start IP=https://targetPage
  mainWindow.loadURL(URL);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  function createMainMenu() {
    const template = [
      {
        label: "Lists",
        submenu: [
          {
            label: "Create new list",
            accelerator: "CommandOrControl+N",
            click() {
              mainWindow.webContents.send("create-list");
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
  mainWindow.removeMenu();
  
  mainWindow.on("ready", () =>{
    createWindow();
    createMainMenu();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.commandLine.appendSwitch('ignore-certificate-errors', 'true')

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
