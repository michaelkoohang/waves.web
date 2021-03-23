
// load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// import libraries
const axios = require("axios");       // http library
const qs = require("qs");             // query string library
const express = require("express");   // express web framework

// instantiate express app and connect to db
const app = express();
const db = require('./model/db');

// create routes
const authRouter = require('./routes/auth/auth');
const friendsRouter = require('./routes/friends/friends');
const radarRouter = require('./routes/radar/radar');

// add middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', authRouter);
app.use('/api', friendsRouter);
app.use('/api', radarRouter);

// accept form-urlencoded submissions
axios.interceptors.request.use(request => {
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data);
  }
  return request;
});

module.exports = app;
