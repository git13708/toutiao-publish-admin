module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '头条-管理端'
        return args
      })
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
