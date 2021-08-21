module.exports = {
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
}
