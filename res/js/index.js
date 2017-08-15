const DaMonitorModule = (function() {

  // Variable declaration

  let $mainHeader = $('#main-header'),

  $cpuJumbotron = null,
  $cpuProgress = null,
  $cpuCores = null,
  $cpuFree = null,
  $cpuName = null,
  $cpuUsage = null,
  cpuInterval = null,

  $ramJumbotron = null,
  $ramProgress =null,
  $ramUsage = null,
  $ramFree = null,
  $ramTotal = null,
  ramInterval = null;

  // Loading a component

  function loadComponent(component) {

    component = `${component}.html`;

    return new Promise(resolve => {
      $.get(component, function(data) {
        $mainHeader.after(data);
        resolve(data);
      });
    });

  }

  // "Unloading" (Hiding) a component

  function unloadComponent(component) {

    let error = new Error('Cannot unload a component that hasn\'t been loaded');

    switch(component) {
      case 'cpu':
      if(cpuInterval === null) throw error;
      clearInterval(cpuInterval);
      $cpuJumbotron.hide();
      cpuInterval = null;
      break;

      case 'ram':
      if(ramInterval === null) throw error;
      clearInterval(ramInterval);
      $ramJumbotron.hide();
      ramInterval = null;
      break;

      default:
      throw new Error('That component doesn\'t exist');
      break;

    }

  }

  // Get info from the os and display it

  function MonitorCPU() {
    $cpuCores.text(`Virtual Cores: ${os.cpuCount()}`);
    $cpuName.text(`CPU Name: ${require('os').cpus()[0].model}`);

    os.cpuUsage(function(v) {
      let usage = Math.floor(v*100);

      if(usage < 50)
        $cpuProgress.css('background-color', '#5cb85c');
      else if(usage >= 50)
        $cpuProgress.css('background-color', '#ec971f');
      else if(usage >= 75)
        $cpuProgress.css('background-color', '#c9302c');

      $cpuProgress.css('width', `${usage}%`);
      $cpuUsage.text(`CPU Usage: ${usage}%`);
      $cpuFree.text(`Free CPU: ${100 - usage}%`);
    });
    os.cpuFree(function(v) {

    });
  }

  function MonitorRAM() {

  }

  return {
    Initialize: function() {
      WindowJS();
    },
    MonitorCPU: async function() {
      await loadComponent('cpu');
      $cpuJumbotron = $('#cpu-monitor');
      $cpuProgress = $('#cpu-progress');
      $cpuCores = $('#cpu-cores');
      $cpuFree = $('#cpu-free');
      $cpuName = $('#cpu-name');
      $cpuUsage = $('#cpu-usage');
      cpuInterval = setInterval(MonitorCPU, 1e3);
    },
    MonitorRAM: async function() {
      await loadComponent('ram');
      ramInterval = setInterval(MonitorRAM, 1e3);
      $ramJumbotron = $('#ram-monitor');
      $ramProgress = $('#ram-progress');
      $ramUsage = $('#ram-usage');
      $ramFree = $('#ramFree');
      $ramTotal = $('#ram-ammount');
    },
    HideComponent: unloadComponent
  }

})();
