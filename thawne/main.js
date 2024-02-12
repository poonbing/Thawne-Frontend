const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const path = require('path');
 
const isDev = process.env.IS_DEV == "true" ? true : false;
 
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    frame: true,
    icon: path.join(__dirname, 'public', 'icons', 'icon.ico'),
    autoHideMenuBar: true,

    

    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './electron/preload.js'),

    },
  });




  mainWindow.setContentProtection(true);

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
 
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  ipcMain.on('show-dialog', (event) => {
    dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Leave Page?',
        message: 'Should I leave this page?'
    }).then((result) => {
        if (result.response === 0) {
            mainWindow.loadFile('public/redirectpage.html');
        } else {
            mainWindow.webContents.send('dialog-closed');
        }
    }).catch((err) => {
        console.error(err);
    });
});


}

if (process.platform === 'win32')
{
    app.setAppUserModelId(app.name);
}


app.setUserTasks([
])

app.whenReady().then(() => {

  createWindow()

  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

