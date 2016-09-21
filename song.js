'use strict';

const crypt = require('crypto');

class Song {
  constructor(track, artist, time) {
    this._track = track;
    this._artist = artist;
    this._time = time;
  }

  set track(track) {
    this._track = track;
  }
  set artist(artist) {
    this._artist = artist;
  }
  set time(time) {
    this._time = time;
  }
  set meta(meta) {
    this._meta = meta;
  }

  get track() {
    return this._track.trim();
  }
  get artist() {
    return this._artist.trim();
  }
  get time() {
    return this._time.split('@')[1].trim().toLowerCase();
  }
  get meta() {
    return this._meta;
  }

  get hashContents() {
    return this.track + this.artist + this.time;
  }
  get hash() {
    return crypt.createHash('md5').update(this.hashContents).digest('hex');
  }

  isSameAs(otherSong) {
    return (
      this.track === otherSong.track &&
      this.artist === otherSong.artist &&
      this.time === otherSong.time
    );
  }
}

module.exports = Song;
