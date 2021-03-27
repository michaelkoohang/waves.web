const axios = require("axios");

module.exports = {
  // Login to Spotify
  login: (authToken) => {
    return axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
  }
}