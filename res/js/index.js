const DaMonitorModule = (function() {

  let $cpuProgress = $('#cpu-progress'), $cpuCores = $('#cpu-cores'), $cpuFree = $('#cpu-free'), $cpuName = $('#cpu-name'), $cpuUsage = $('#cpu-usage');

  return {
    Initialize: function() {
      WindowJS();
      setInterval(function() {

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
      }, 1e3);
    }
  }

})();
