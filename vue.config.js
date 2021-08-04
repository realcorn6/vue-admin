const path = require("path");
//主要是用于分析项目的大小占比的，不需要的话可以注释掉
// const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  // 部署应用时的基本 URL
  //部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)cli3.0以上使用publicPath替代baseUrl,解决build后找不到静态资源的问题
  publicPath: process.env.NODE_ENV === "production" ? "../" : "",
  // build时构建文件的目录 构建时传入 --no-clean 可关闭该行为
  outputDir: process.env.NODE_ENV === "production" ? "../dist" : "dist", // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录(默认'')
  assetsDir: "assets",
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)，也可以是一个绝对路径。
  indexPath: "index.html",
  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 检查代码(在生产构建时禁用 eslint-loader)
  lintOnSave: process.env.NODE_ENV !== "production",
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 生产环境是否生成 sourceMap 文件,如果你不需要生产环境的 source map,可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  // Babel 显式转译列表，暂时没有用到
  transpileDependencies: [],
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性（注：仅影响构建时注入的标签）
  crossorigin: "",
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  integrity: false,
  // 构建多页面应用，页面的配置，一般用不到
  devServer: {
    //所有 webpack-dev-server 的选项都支持。
    //主要是用于交互接口的调试
    disableHostCheck: true,
    host: "0.0.0.0", //localhost
    port: 8080,
    https: false,
    hotOnly: false,
    open: true, //配置自动启动浏览器
    overlay: {
      //配置eslint报错的级别
      // warnings: true,
      // error: true
    },
    proxy: {
      // 配置多个代理(配置一个 proxy: 'http://localhost:4000' // 本地模拟数据服务器)
      // "/dd": {
      //     target: "http://10.64.88.27:8088/",
      //     ws: true,
      //     changeOrigin: true
      // },
      // "/dd": {
      //   target: "http://10.64.90.8:8088/",//10.64.90.46
      //   ws: true,
      //   changeOrigin: true
      // },
      "/api": {
        target: "http://www.web-jshtml.cn/productapi/token", // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          // 路径重写，
          "^/api": "", // 替换target中的请求地址，也就是说/api=/target，请求target这个地址的时候直接写成/api即可。
        },
      },
    },
  },
  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
  // 如果你需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
    } else {
      // 为生产环境修改配置...
      config.mode = "development";
    }
    // 开发生产共同配置别名
    Object.assign(config.resolve, {
      alias: {
        'vue': 'vue/dist/vue.js',
        "@": path.resolve(__dirname, "./src"),
        assets: path.resolve(__dirname, "./src/assets"),
        common: path.resolve(__dirname, "./src/common"),
        components: path.resolve(__dirname, "./src/components"),
        network: path.resolve(__dirname, "./src/network"),
        configs: path.resolve(__dirname, "./src/configs"),
        views: path.resolve(__dirname, "./src/views"),
        plugins: path.resolve(__dirname, "./src/plugins"),
      },
    });
  },
  // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options({
          symbolId: "icon-[name]",
          include: ["./src/icons"]
        });
    // if (IS_PROD) {
    //主要是对打包的文件生成配置，可以将某些引用的第三方插件单独打包出来
    config.optimization.splitChunks({
      minSize: 30000, //依赖包超过300000bit将被单独打包
      minChunks: 1, // 模块的最小被引用次数
      // maxAsyncRequests: 5, // 按需加载的最大并行请求数
      // maxInitialRequests: 3, // 一个入口最大并行请求数
      // automaticNameDelimiter: '~', // 文件名的连接符
      name: true,
      cacheGroups: {
        common: {
          name: "chunk-common", // 打包后的文件名
          chunks: "initial", //可选值有：'all'（所有代码块），'async'（按需加载的代码块），'initial'（初始化代码块）
          maxInitialRequests: 5,
          priority: 1, //缓存组打包的先后优先级，数值大的优先
          reuseExistingChunk: true, //如果当前代码块包含的模块已经有了，就不在产生一个新的代码块
        },
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
        antDesignVue: {
          name: "chunk-ant-design-vue",
          test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
          chunks: "initial",
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        moment: {
          name: "moment",
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          chunks: "initial",
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
        coreJs: {
          name: "chunk-core-js",
          test: /[\\/]node_modules[\\/]core-js[\\/]/,
          chunks: "initial",
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        // styles: {
        //     name: 'styles',
        //     test: /\.(sa|sc|c)ss$/,
        //     chunks: 'all',
        //     enforce: true,
        // },
      },
    });
    // }
  },
  // css的处理
  css: {
    // 当为true时，css文件名可省略 module 默认为 false
    requireModuleExtension: true,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中
    // 默认生产环境下是 true，开发环境下是 false
    //是否使用css分离插件 ExtractTextPlugin 开启CSS分离之后每个组件的css会单独打包，造成页面上有大量请求，所以在正式环境中将CSS分离关闭
    extract: process.env.NODE_ENV === "production",
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    sourceMap: false,
    // requireModuleExtension: false,// 启用 CSS modules for all css / pre-processor files.
    //向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    //css预设器配置项
    loaderOptions: {
      scss: {
        prependData: '@import "./src/styles/main.scss";',
      },
    },
  },
  // 是否为 Babel 或 TypeScript 使用 thread-loader 一般用不到
  parallel: require("os").cpus().length > 1,
  // 向 PWA 插件传递选项 一般用不到
  pwa: {},
  // 可以用来传递任何第三方插件选项 一般用不到
  pluginOptions: {},
};
