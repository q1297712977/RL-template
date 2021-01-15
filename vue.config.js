const path = require('path');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://gateway.ftms.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/virtual': {
        target: 'https://www.fastmock.site/mock/f72db5d0ec43eb5440677fd3f9078e86/virtual',
        changeOrigin: true,
      },
    }
  },
  //配置less
  lintOnSave: false,

  publicPath: '/', // 公共路径
  indexPath: 'index.html', // 相对于打包路径index.html的路径
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // 向 PWA 插件传递选项。
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    });
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'));

      //配置less
      config.module
      .rule('scss')
      .test(/\.scss$/)
      .oneOf('vue')
      .use('px2rem-loader')
      .before('postcss-loader')
      .loader('px2rem-loader')
      .options({
        remUnit: 192,
        remPrecision: 8
      })
      .end()
      .use('sass-loader').options({
        sassOptions:{
          outputStyle:'expanded'
        }
      })

  
  },
  configureWebpack: {
    devtool: 'source-map'
  }

}