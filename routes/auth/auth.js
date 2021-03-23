const axios = require("axios");
const db = require('../../model/db');
const express = require('express');
const router = express.Router();
const token = require('../../utils/token');

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
  
  axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  }).then(data => {
    let response = data.data;
    const newUser = new db.User({
      name: response.display_name,
      username: response.id,
      authToken: authToken,
      refreshToken: refreshToken,
      service: service,
      friends: []
    })
    db.User.countDocuments({ username: newUser.username }, (err, count) => {
      if (err) {}
      if (count > 0) {
        res.json({messsage: "User already exists. Logged in."});
      } else {
        newUser.save((err, user) => {
          if (err) return console.error(err);
          res.json({message: "New user created. Logged in.", user});
        });
      }
    });
  })
  .catch(err => {
    console.error(err)
  })
});

module.exports = router