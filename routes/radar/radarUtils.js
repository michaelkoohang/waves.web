
const axios = require("axios");

module.exports = {
  // Get top tracks for user
  getTopTracks: (authToken, limit) => {
    return axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me/top/tracks",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
      },
      params: {
        limit
      },
      validateStatus: function (status) {
        return status < 500; 
      }
    });
  }
}