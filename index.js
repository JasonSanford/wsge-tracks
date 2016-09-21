'use strict';

const DEBUG = false;

const menubar = require('menubar');

const mb = menubar({
  dir: __dirname + '/app',
  width: 440,
  height: 400,
  preloadWindow: true
});

mb.on('after-create-window', function () {
  if (DEBUG) {
    mb.window.openDevTools();
  }
});

mb.on('ready', function ready () {
  console.log('app is ready');
});
