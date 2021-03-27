const express = require('express');
const router = express.Router();
const db = require('../../model/db');
const {map} = require('lodash');

// get a user's list of friends
router.get("/friends", (req, res) => {
  let username = req.headers.username;
  db.User.find({username: username}).exec()
  .then(user => {
    return Promise.all(map(user[0].friends, friend => {
      return db.User.findById(friend).select('name username service -_id').exec();
    }));
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(400).send("UserID does not exist!");
  });
});

module.exports = router
