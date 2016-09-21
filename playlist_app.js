'use strict';

const request = require('request');
const cheerio = require('cheerio');

const Song = require('./song');

const STATE_OFF = 'off';
const STATE_ON = 'on';
const FETCH_TIME_INTERVAL = 40000;

const PLAYLIST_URL = 'http://playlist.wsge.org/full_list.php';

class App {
  constructor() {
    this.lastSong = null;
    this.state = STATE_ON;

    this.startFetching();
  }

  startFetching() {
    this.fetchPlaylist();
    this.fetchInterval = setInterval(this.fetchPlaylist.bind(this), FETCH_TIME_INTERVAL);
  }

  fetchPlaylist() {
    request(PLAYLIST_URL, this.processPlaylist.bind(this));
  }

  processPlaylist(error, response, html) {
    if (error) {
      console.log('Error fetching playlist:');
      return console.log(error);
    }

    const $doc = cheerio.load(html);
    const $songs = $doc('tr.odd,tr.even');
    const recentSong = this.songFromTableRow(cheerio($songs[0]));

    if (!this.lastSong || (this.lastSong && !this.lastSong.isSameAs(recentSong))) {
      this.lastSong = recentSong;
      this.showNewSongNotification();
    } else {
      //console.log('Same song');
      //console.log(recentSong);
    }

    /*$songs.each(function (i, song) {
      const $songParts = cheerio(song).find('td');

      console.log('song .......');
      $songParts.each(function (o, part) {
        console.log(cheerio(part).text());
      });
    });*/
  }

  setState(onOrOff) {
    const previousState = this.getState();

    if (previousState === onOrOff) {
      return;
    }

    this.state = onOrOff;

    if (this.state === STATE_OFF) {
      clearInterval(this.fetchInterval);
    } else {
      this.startFetching();
    }
  }

  getState() {
    return this.state;
  }

  songFromTableRow($recentSong) {
    const $songParts = $recentSong.find('td');

    const track = cheerio($songParts[0]).text();
    const artist = cheerio($songParts[1]).text();
    const time = cheerio($songParts[2]).text();

    return new Song(track, artist, time);
  }

  showNewSongNotification() {
    const song = this.lastSong;
    console.log('New Song!');
    const notificationOptions = {
      title: song.track,
      body: song.artist,
      silent: true
    };
    const notification = new Notification(song.track, notificationOptions);
    notification.onclick = function () {
      console.log('they clicked it');
    };
    console.log(song);
    //ipc.send('new-song', this.lastSong);
  }
}

App.STATE_OFF = STATE_OFF;
App.STATE_ON = STATE_ON;

module.exports = App;
