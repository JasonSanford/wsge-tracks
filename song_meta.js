'use strict';

class SongMeta {
  constructor(data) {
    this.data = data;
    this.track = this.data.tracks.items[0];
  }

  get uri() {
    return this.track.uri;
  }

  get webUri() {
    return this.track.external_urls.spotify;
  }
}

module.exports = SongMeta;
