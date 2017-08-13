const WindowJS = (function() {
  if(typeof jQuery == "undefined") throw new Error("WindowJS requires jQuery to run");

  let $mi = $('#minimize'), $ma = $('#maximize'), $cl = $('#close'), settings;

  function bind() {
    $cl.click(function() {
      window.close();
    });
    $mi.click(function() {
      remote.BrowserWindow.getFocusedWindow().minimize();
    });
    $ma.click(function() {
      remote.BrowserWindow.getFocusedWindow().maximize();
    });
  }

  function unbindAll() {
    $cl.unbind();
    $mi.unbind();
    $ma.unbind();
  }

  function disable(btn) {
    btn.css({color: '#BDC3C7', backgroundColor: '#BDC3C7', cursor: 'default'});
    btn.unbind();
  }

  function init() {
    bind();
    settings = config.windowjs;

    for (btn in settings) {
      if(!settings[btn]) disable($(`#${btn}`));
    }
  }

  return init;

})();
