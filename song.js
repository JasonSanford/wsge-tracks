'use strict';

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

  get track() {
    return this._track.trim();
  }
  get artist() {
    return this._artist.trim();
  }
  get time() {
    return this._track.trim();
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
