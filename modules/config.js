const path = require('path'),
fs = require('fs'),
configPath = path.join(__dirname, '../', 'config.json');

let factoryDefaults =
{
    app: {
      title: 'DaMonitor',
    },
    win: {
      width: 800,
      height: 600,
      frame: false,
      resizable: false,
      icon: path.join(__dirname, '/..', 'res/img/favicon.png')
    },
    windowjs: {
      minimize: true,
      maximize: false,
      close: true,
    },
    devEnvironment: true,

}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath).toString());
  } catch(e) {
    resetConfig();
    return factoryDefaults;
  }
}

function resetConfig() {
  try {
    fs.writeFileSync(configPath, JSON.stringify(factoryDefaults, null, 2), 'utf8');
  } catch(e) {
    console.log('An error occured while resetting config:', e.toString());
  }
}

module.exports = {
  loadConfig: loadConfig,
  resetConfig: resetConfig
}
