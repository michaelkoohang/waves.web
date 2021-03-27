
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

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