// const withPlugins = require('next-compose-plugins');
// const withImages = require('next-images');

const nextConfig = {
  reactStrictMode: true,
  env: {
    GMAPKEY: process.env.GMAPKEY,
    API_KEY: process.env.API_KEY,
    PASS_HASH: process.env.PASS_HASH,
    FB_APIKEY: process.env.FB_APIKEY,
    FB_DOMAIN: process.env.FB_DOMAIN,
    FB_PROJECTID: process.env.FB_PROJECTID,
    FB_BUCKET: process.env.FB_BUCKET,
    FB_MESSAGINGSENDER: process.env.FB_MESSAGINGSENDER,
    FB_APPID: process.env.FB_APPID,
    FB_MEASUREMENTID: process.env.FB_MEASUREMENTID,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    // CUSTOMKEY: process.env.CUSTOMKEY,
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
}

module.exports = nextConfig;
