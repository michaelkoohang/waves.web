const auth = require('../../utils/jwt');
const db = require('../../model/db');
const express = require('express');
const router = express.Router();
const token = require('../../utils/token');
const utils = require('./authUtils');

// get an access token
router.post("/token", ({body: {code: authorization_code}}, response) => {
  token.newToken(authorization_code)
  .then(({data: json}) => {
    response.set("Content-Type", "text/json").status(200).send(json);
  }).catch(({response: err}) => {
    response.set("Content-Type", "text/json").status(402).send(err.data);
  });
});

// get an access token with a refresh token
router.post("/refresh_token", ({body: {refresh_token}}, response) => {
  token.refreshToken(refresh_token)
  .then(({data: json}) => {
    response.set("Content-Type", "text/json").status(200).send(json);
  }).catch(({response: err}) => {
    response.set("Content-Type", "text/json").status(402).send(err.data);
  });
});

// login to waves
router.post("/login", (req, res) => {
  let authToken = req.body.authToken
  let refreshToken = req.body.refreshToken
  let service = req.body.service
  
  utils.login(authToken)
    .then(data => {
      let response = data.data;
      let jwtToken = auth.makeAccessToken(response.id)
      const newUser = new db.User({
        name: response.display_name,
        username: response.id,
        authToken: authToken,
        refreshToken: refreshToken,
        service: service,
        friends: []
      });
      db.User.countDocuments({ username: newUser.username }, (err, count) => {
        if (err) {};
        if (count > 0) {
          res.json({username: response.id, token: jwtToken});
        } else {
          newUser.save((err, user) => {
            if (err) return console.error(err);
            res.json({username: response.id, token: jwtToken});
          });
        }
      });
    })
    .catch(() => {
      res.status(401).send('Unauthorized');
    });
});

module.exports = router