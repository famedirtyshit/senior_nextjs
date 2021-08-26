const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const nextConfig = {
  reactStrictMode: true,
  env: {
    GMAPKEY: process.env.GMAPKEY,
    API_KEY: process.env.API_KEY,
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

module.exports = withPlugins([[withImages]], nextConfig);
