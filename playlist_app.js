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
    this.songs = null;
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
    }

    const newSongs = $songs.map(function (i, song) {
      return this.songFromTableRow(cheerio(song));
    }.bind(this)).toArray();

    this.songs = newSongs;

    this.refreshPlaylist();
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

    const notificationOptions = {
      title: song.track,
      body: song.artist,
      silent: true
    };

    const notification = new Notification(song.track, notificationOptions);
    notification.onclick = function () {
      console.log('they clicked it');
    };
  }

  refreshPlaylist() {
    const $playlist = $('.playlist');
    $playlist.html('');

    this.songs.forEach(function (song) {
      $playlist.append(
        `<tr>
          <td class="track">${song.track}</td>
          <td>${song.artist}</td>
          <td class="time">${song.time}</td>
        </tr>`
      );
    });
  }
}

App.STATE_OFF = STATE_OFF;
App.STATE_ON = STATE_ON;

module.exports = App;
