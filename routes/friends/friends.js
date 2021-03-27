const express = require('express');
const router = express.Router();
const db = require('../../model/db');
const {map} = require('lodash');

// get a user's list of friends
router.post("/friends", (req, res) => {
  let userId = req.body.userId;
  db.User.find({username: userId}).exec()
  .then(user => {
    return Promise.all(map(user[0].friends, friend => {
      return db.User.findById(friend).select('name username service -_id').exec();
    }));
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send("UserID does not exist!");
  });
});

module.exports = router
