const {app, BrowserWindow} = require('electron'),
path = require('path'),
url = require('url'),
config = require('./modules/config.js');

let window, settings = config.loadConfig();

function createWindow() {
  window = new BrowserWindow(settings.win);
  loadView('index.html');

  if(settings.devEnvironment)
    window.webContents.openDevTools();
  else
    window.setMenu(null);

  window.on('close', () => {
    window = null;
  });

}

function loadView(view) {
  if(window !== null) {
      window.loadURL(url.format({
        pathname: path.join(__dirname, 'res', view),
        protocol: 'file:',
        slashes: true
      }));
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});
