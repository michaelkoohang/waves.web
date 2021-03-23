const btoa = require("btoa");
const axios = require("axios");

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_CLIENT_CALLBACK_URL = process.env.SPOTIFY_CLIENT_CALLBACK_URL;

module.exports = {
  // Get new access token with refresh token
  refreshToken: (refresh_token) => {
    return axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)
      },
      data: {
        grant_type: "refresh_token",
        refresh_token: refresh_token
      }
    })
  },
  
  // Get new access token and refresh token with authorization code
  newToken: (authorization_code) => {
    return axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)
      },
      data: {
        grant_type: "authorization_code",
        redirect_uri: SPOTIFY_CLIENT_CALLBACK_URL,
        code: authorization_code
      }
    })
  }
}