module.exports = {
  webpack: (config, options, webpack) => {
    config.target = 'web'
    config.plugins.splice(1, 1) // remove BannerPlugin
    return config
  }
}
