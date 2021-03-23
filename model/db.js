const mongoose = require('mongoose');
const dbURL = process.env.MONGO_URI;
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  authToken: String,
  refreshToken: String,
  service: String,
  friends: Array
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
}