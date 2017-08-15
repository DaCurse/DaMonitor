const DaMonitorModule = (function() {

  // Variable declaration

  let $mainHeader = $('#main-header'),

  $menu = null,
  $goBack = null,

  $cpuOption = null,
  $cpuJumbotron = null,
  $cpuProgress = null,
  $cpuCores = null,
  $cpuFree = null,
  $cpuName = null,
  $cpuUsage = null,
  cpuInterval = null,

  $ramOption = null,
  $ramJumbotron = null,
  $ramProgress = null,
  $ramUsage = null,
  $ramFree = null,
  $ramTotal = null,
  ramInterval = null;

  // Event binding

  function bind(state) {
    if(state)
      $goBack.bind('click', event => {
        let from = $(event.target).attr('data-from');
        unloadComponent(from);
        $menu.show();
        bind(false);
        unbind(false);
      });
    else {
      $cpuOption.bind('click', () => {
        unloadComponent('menu');
        MonitorCPU(true);
        unbind(true);
        bind(true);
      });
      $ramOption.bind('click', () => {
        unloadComponent('menu');
        MonitorRAM(true);
        unbind(true);
        bind(true);
      });
    }
  }

  // Unbinding events to save memory

  function unbind(state) {
    if(!state)
      $goBack.unbind('click');
    else {
      $cpuOption.unbind('click');
      $ramOption.unbind('click');
    }
  }

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

      case 'menu':
      $menu.hide();
      break;


      default:
      throw new Error('That component doesn\'t exist');
      break;

    }

  }

  // Get info from the os and display it

  function MonitorCPU(state) {

    if(state) {
      $cpuJumbotron.show();
      cpuInterval = setInterval(() => {
        $cpuCores.text(`Virtual Cores: ${os.cpuCount()}`);
        $cpuName.text(`CPU Name: ${require('os').cpus()[0].model}`);

        os.cpuFree(function(v) {
          let free = Math.floor(v*100);
          let usage = Math.floor(100 - free);

          if(usage < 50)
            $cpuProgress.css('background-color', '#5cb85c');
          else if(usage >= 50)
            $cpuProgress.css('background-color', '#ec971f');
          else if(usage >= 75)
            $cpuProgress.css('background-color', '#c9302c');

          $cpuProgress.css('width', `${usage}%`);
          $cpuUsage.text(`CPU Usage: ${usage}%`);
          $cpuFree.text(`Free CPU: ${free}%`);
        });
        os.cpuFree(function(v) {

        });
      }, 500);
    } else unloadComponent('cpu');

  }

  function MonitorRAM(state) {

    if(state) {
      $ramJumbotron.show();
      ramInterval = setInterval(() => {
        let convertDataTypes = function(mb) {
          return (mb < 900) ?
          `${mb.toFixed(2)}MB` : `${(mb / 1024).toFixed(2)}GB`;
        }

        let totalMem = convertDataTypes(os.totalmem());
        let freeMem = convertDataTypes(os.freemem());
        let freeMemP = os.freememPercentage() * 100;
        let usedMem = convertDataTypes(os.totalmem() - os.freemem());
        let usedMemP = 100 - freeMemP;

        $ramTotal.text(`Installed Memory: ${totalMem}`);
        $ramFree.text(`Free Memory: ${Math.floor(freeMemP)}% (${freeMem})`);
        $ramUsage.text(`Memory Used: ${Math.floor(usedMemP)}% (${usedMem})`);
        $ramProgress.css('width', `${usedMemP}%`);
      }, 500);
    } else unloadComponent('ram');

  }

  // Setup

  return {
    Initialize: async function() {
      WindowJS();
      await loadComponent('menu');
      await loadComponent('cpu');
      await loadComponent('ram');
      $menu = $('#menu');
      $goBack = $('.go-back');
      $cpuOption = $('.cpu');
      $ramOption = $('.ram');
      $cpuJumbotron = $('#cpu-monitor');
      $cpuProgress = $('#cpu-progress');
      $cpuCores = $('#cpu-cores');
      $cpuFree = $('#cpu-free');
      $cpuName = $('#cpu-name');
      $cpuUsage = $('#cpu-usage');
      $ramJumbotron = $('#ram-monitor');
      $ramProgress = $('#ram-progress');
      $ramUsage = $('#ram-usage');
      $ramFree = $('#ram-free');
      $ramTotal = $('#ram-ammount');
      bind();
    },
    MonitorCPU: MonitorCPU,
    MonitorRAM: MonitorRAM
  }

})();
