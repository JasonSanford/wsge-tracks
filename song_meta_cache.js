'use strict';

const request = require('request');

const SongMeta = require('./song_meta');

class SongMetaCache {
  constructor() {
    this.cache = {};
  }

  checkMeta(song) {
    return this.cache[song.hash];
  }

  forceMeta(song, callback) {
    this.searchSpotify(song, function (error, response, data) {
      if (error) {
        return callback(error);
      }

      data = JSON.parse(data);

      let meta;

      if (data && data.tracks && data.tracks.total > 0) {
        meta = new SongMeta(data);
      } else {
        meta = null;
      }

      this.cache[song.hash] = meta;

      callback(null, meta);
    }.bind(this));
  }

  searchSpotify(song, callback) {
    const options = {
      uri: 'https://api.spotify.com/v1/search',
      qs: {
        type: 'track',
        offset: '0',
        limit: '20',
        query: `track:${song.track} artist:${song.artist}`
      }
    };

    request(options, callback);
  }
}

module.exports = SongMetaCache;
