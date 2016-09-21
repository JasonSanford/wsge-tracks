'use strict';

const remote = require('electron').remote;
const app = remote.app;

const PlaylistApp = require('../playlist_app');

const playlistApp = new PlaylistApp();

function switchStateToPlaylistState (playlistState) {
  return (playlistState ? PlaylistApp.STATE_ON : PlaylistApp.STATE_OFF);
}

const $toggleSwitch = $('.toggle-switch');

$toggleSwitch.bootstrapSwitch({
  onText: 'on',
  offText: 'off',
  onSwitchChange: function (event, state) {
    playlistApp.setState(switchStateToPlaylistState(state));
  }
});

const $quit = $('.quit');

$quit.on('click', function () {
  app.quit();
});
