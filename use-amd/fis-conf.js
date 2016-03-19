
/**
 * fis3-hook-module
 * fis3 已经默认不自带模块化开发支持，需要此插件来完成模块化开发的支持。
     针对 isMod 为 true 的 js 文件自动 amd 包裹。
     针对所有 js 文件和 js 片段，检测 require 语法，自动标记依赖（包括异步依赖）。
     扩展 require 路径支持。支持无后缀写法。如：require('./xxx') 等价于 require('./xxx.js').
     扩展 require 路径支持。支持 baseUrl、paths 和 packages 配置。详情看配置说明。
     针对 mode 设置成 'amd' 的情况下，进行 shim 包裹。 详情看配置说明。

 配置说明
     fis.hook('module', {
         wrap: '',                  // wrap 默认 undefined.可以通过设置此值来给 js 文件进行包裹。当文件 isMod 为 true 时，会对文件以 amd 的方式包裹。
                                    // 可选值：
                                    // - `amd` 即 amd 包裹
                                    // - `closure` 即闭包包裹。
                                    // - false 或者 null 或者留空时不进行处理，isMod 为 true 的文件除外。isMod 为 true 的文件，会进行 amd 方式包裹。
         mode: 'auto',              // 默认 auto 根据文件内容自动判断是 commonJs 还是 amd。不准确，建议设置其中一种。分为两种：
                                    // `commonJs` 选用此方案，性能最好，规则更简单
                                    // `amd` 需要词法分析，时间略长。
                                    //  当设置为 auto 的时候，程序自动判断。
         baseUrl: '.',              //  默认为 .。配置 baseUrl, 配置，页面中的 require 路径都是基于此路径查找的。
                                    // https://github.com/amdjs/amdjs-api/blob/master/CommonConfig.md#baseurl-
         paths: {},                 // 设置引用别名,可以给项目中的路径或者文件建立别名。如：
                                    // {
                                    //   libs: '/static/libs',
                                    //   jquery: '/static/libs/jquery'
                                    // }
                                    // 那么:
                                    // require('libs/alert'); 就等价于 require('/static/libs/alert');
                                    // requrire('jquery');  等价于： require('/static/libs/jquery');
                                    // 更多信息请参考。https://github.com/amdjs/amdjs-api/blob/master/CommonConfig.md#paths-
         packages: [],              // 用来配置包信息
                                    // 后续补充
                                    // 届时，请参考。https://github.com/amdjs/amdjs-api/blob/master/CommonConfig.md#packages-
         forwardDeclaration: false, // 是否依赖前置,默认为FALSE
                                    // 即是否将 factory 中的 require 对象，前置放在 define 的第二个参数中。
                                    // 对于 amd loader 来说可以免去解析 factory 的操作。推荐给用  amd loader。
                                    // 注意： 用  mod.js 作为 loader 时，勿用!!!!
         skipBuiltinModules: false, // 默认false,当开启依赖前置后有效，用来控制 amd 的内建模块是否需要保留在 deps 第二个参数中。
                                    // 如: require, exports, module
                                    // 像 cmd 是不需要的，所以模式是 cmd 时，自动会开启。
          globalAsyncAsSync: false, // 是否将全局的 require(['jquery']) 异步用法当成同步？
                                    // 当成同步，js 加载不再走 loader 而是，直接页面源码中输出 <script> 标签到页面，用 <script> 来加载。
      // 当 mod 为 amd 时，以下配置才有效。
      //  shim: null,// 届时，请参考。https://github.com/amdjs/amdjs-api/blob/master/CommonConfig.md#shim-
      // 用来设置无后缀引用模块时，对模块的定义的文件查找顺序。
      // 如： require('./main')
      // 查找顺序为：require('./main.js') require('./main.coffee') require('./main.jsx')
      // extList: ['.js', '.coffee', '.jsx']
   });

 *
 */


// npm install [-g] fis3-hook-module
fis.hook('module', {
    mode: 'amd',
    forwardDeclaration: true// 是否依赖前置
});

fis.match('/comp/**/*.js', {
    isMod: true, // 标示文件是否为组件化文件，被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。。设置 comp 下都是一些组件，组件建议都是匿名方式 define
    release: '/static/$0'//设置文件的产出路径。默认是文件相对项目根目录的路径，以 / 开头。该值可以设置为 false ，表示为不产出
});

fis.match('::package', {//打包插件 --->值类型：Array | fis.plugin | function
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    //打包后处理插件
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true // 资源映射表内嵌
    })
})

// fis3 release prod 产品发布，进行合并
fis.media('prod')
    .match('*.js', {
        packTo: '/static/aio.js'
    });
