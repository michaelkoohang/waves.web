
const auth = require('../../utils/jwt');
const express = require('express');
const router = express.Router();
const db = require('../../model/db');
const token = require('../../utils/token');
const utils = require('./radarUtils');

// get a user's radar
router.get("/radar", auth.authenticateToken, (req, res) => {
  let username = req.headers.username;
  db.User.findOne({username: username}).exec()
    .then(user => {
      return utils.getTopTracks(user.authToken, 5)
        .then(response => {
          if (response.status !== 401) {
            return parseSpotifyResponse(response.data);
          } else {
            return token.refreshToken(user.refreshToken)
              .then(authToken => {
                let newAuthToken = authToken.data.access_token;
                return utils.getTopTracks(newAuthToken, 5)
                  .then(newSongs => {
                    let result = parseSpotifyResponse(newSongs.data);
                    user.authToken = newAuthToken;
                    user.save();
                    return result;
                  })
              })
              .catch(() => {
                res.status(400).send('Refresh failed.');
              });
          }
        })
    })
    .then(topTracks => {
      res.send(topTracks);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

function parseSpotifyResponse(data) {
  let songs = [];
  data.items.forEach((val) => {
    let artists = [];
    let uri = val.uri;
    let name = val.name;
    val.artists.forEach((val) => {
      artists.push(val.name);
    })
    songs.push({
      artists: artists.join(', '),
      uri,
      name
    });
  });
  return songs
}

module.exports = router
