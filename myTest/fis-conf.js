/***
 * 配置接口：
 * match://为某一个文件分配不同的属性,这些属性控制这个文件经过怎么样的操作
 *      fis.match(selector, props[, important]);
 *          selector：glob 或者是任意正则
 *          props：文件属性
 *          important：bool 设置了这个属性为 true，即表示设置的规则无法被覆盖；具体行为可参考 css !important
 * media:模仿自 css 的 @media在不同状态下，给文件分配不同属性，其意味着有多份配置，每一份配置都可以让 fis3 进行不同的编译；
 *      fis.media(mode);
 *          mode:string mode，设定不同状态，比如 rd、qa、dev、production
 * set：
 *      fis.set(key, value)//设置一些配置，如系统内置属性 project、namespace、modules、settings。 fis.set 设置的值通过fis.get()获取
 * plugin:插件调用接口
 *      fis.plugin(name [, props [, place]])
 *          name:插件名，插件名需要特殊说明一下，fis3 固定了插件扩展点，每一个插件都有个类型，体现在插件发布的 npm 包名字上；比如 fis-parser-less 插件，parser指的是在 parser 扩展点做了个解析.less 的插件。
 *          那么设置插件的时候，插件名 less，比如设置一个 parser 类型的插件是这么设置的；
             fis.match('*.less', {
                  parser: fis.plugin('less', {}) //属性 parser 表示了插件的类型
              })
 *          props:对象，给插件设置用户属性
 *
 *
 *全局属性：
 *  内置的默认配置
     var DEFAULT_SETTINGS = {
          project: {
            charset: 'utf8',//指定项目编译后产出文件的编码。通过fis.set('project.charset', 'gbk');设置
            md5Length: 7,   //文件MD5戳长度。
            md5Connector: '_',//设置md5与文件的连字符。
            files: ['**'],    //设置项目源码文件过滤器。
            ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']//排除某些文件,fis.set('project.ignore', ['*.bak']); // set 为覆盖不是叠加
            fileType.text追加文本文件后缀列表
            fileType.image追加图片类二进制文件后缀列表。
          },
          component: {
            skipRoadmapCheck: true,
            protocol: 'github',
            author: 'fis-components'
          },
        modules: {
            hook: 'components',
            packager: 'map'
          },
        options: {}
    };

 * 文件属性
 *        fis3 以文件属性控制文件的编译合并以及各种操作；文件属性包括基本属性和插件属性，插件属性是为了方便在不同的插件扩展点设置插件；
      * packTo
         解释：分配到这个属性的文件将会合并到这个属性配置的文件中
         值类型：string
         默认值：无
         例子：fis.match('/widget/*.js', {packTo: '/static/pkg_widget.js'})
              widget 目录下的所有 js 文件将会被合并到 /static/pkg_widget.js 中。 packTo 设置的是源码路径，也会受到已经设置的 fis.match 规则的影响，比如可以配置fis.match) 来更改 packTo 的产出路径或者 url；

      * packOrder
         解释：用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。
         值类型：Integer
         默认值：0
         fis.match('/*.js', { packTo: 'pkg/script.js'})=
         fis.match('/mod.js', {packOrder: -100})
      * query
         解释：指定文件的资源定位路径之后的query，比如'?t=123124132'。
         值类型：string
         默认值：无
            fis.set('new date', Date.now());
             fis.match('*.js', { query: '?=t' + fis.get('new date')});

      * id
         解释：指定文件的资源id。默认是 namespace + subpath 的值
         值类型：string
         默认值：namespace + subpath
         例子：假设 /static/lib/jquery.js 设定了特定的 id jquery, 那么在使用这个组件的时候，可以直接用这个 id；
             fis.match('/static/lib/jquery.js', {
                  id: 'jquery',
                  isMod: true
              });
            使用 var $ = require('jquery');
       * moduleId
             解释：指定文件资源的模块id。在插件fis3-hook-module里面自动包裹define的时候会用到，默认是 id 的值。
             类型：string
             默认值：**namespace + subpath**
             fis.match('/static/lib/a.js', {
                  id: 'a',
                  moduleId: 'a'
                  isMod: true
              });
             编译前
             exports.a = 10
             编译后
             define('a',function(require,exports,module){
                exports.a = 10
              })

       * url
         解释：指定文件的资源定位路径，以 / 开头。默认是 release 的值，url可以与发布路径 release 不一致。
         值类型：string
         默认值：无
         fis.match('*.{js,css}', {
              release: '/static/$0',
              url: '/static/new_project/$0'
          })
       * isHtmlLike
             解释：指定对文件进行 html 相关语言能力处理
             值类型：bool
             默认值：无
       * isCssLike
             解释：指定对文件进行 css 相关的语言能力处理
             值类型：bool
             默认值：无
       * isJsLike
             解释：指定对文件进行 js 相关的语言能力处理
             值类型：string
             默认值：无
       * useHash
             解释：文件是否携带 md5 戳
             值类型：bool
             默认值：false
             说明：文件分配到此属性后，其 url 及其产出带 md5 戳；
             fis.match('*.css', {  useHash: false });
             fis3 release 时不带hash
       * domain
             解释：给文件 URL 设置 domain 信息
             值类型：string
             默认值：无
             说明：如果需要给某些资源添加 cdn，分配到此属性的资源 url 会被添加 domain；
             fis.media('prod').match('*.js', {
                  domain: 'http://cdn.baidu.com/'
              });
             fis3 release prod 时添加cdn
       * rExt
             解释：设置最终文件产出后的后缀
             值类型：string
             默认值：无
             说明：分配到此属性的资源的真实产出后缀
             fis.match('*.less', {rExt: '.css' });
             源码为.less文件产出后修改为.css文件；

       * useMap
             解释：文件信息是否添加到 map.json
             值类型：bool
             默认值：无
             说明： 分配到此属性的资源出现在静态资源表中，现在对 js、css 等文件默认加入了静态资源表中；
             fis.match('logo.png', {useMap: true});
       * isMod
             解释：标示文件是否为组件化文件。
             值类型：bool
             默认值：无
             说明：标记文件为组件化文件。被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。
             fis.match('/widget/{*,*}.js', {isMod: true});
       *  extras
            注释：在[静态资源映射表][]中的附加数据，用于扩展[静态资源映射表][]表的功能。
            值类型：Object
            默认值：无
            说明：无
            fis.match('/page/layout.tpl', {
                extras: {
                    isPage: true
                }
            });
       * requires
             注释：默认依赖的资源id表
             值类型：Array
             默认值：无
             说明：
             fis.match('/widget/*.js', {
                  requires: [
                      'static/lib/jquery.js'
                  ]
              });
       * useSameNameRequire
             注释：开启同名依赖
             值类型：bool
             默认值：false
             说明：当设置开启同名依赖，模板会依赖同名css、js；js 会依赖同名 css，不需要显式引用。
             fis.match('/widget/**', {
                  useSameNameRequire: true
              });

 * 插件属性
 *  插件属性决定了匹配的文件进行哪些插件的处理；
    *  lint
        启用 lint 插件进行代码检查
         fis.match('*.js', { lint: fis.plugin('js', {}) })
    * parser
         启用 parser 插件对文件进行处理；
         如编译less文件
         fis.match('*.less', {
           parser: fis.plugin('less'), //启用fis-parser-less插件
           rExt: '.css'
        });
    * preprocessor
         标准化前处理
    * postprocessor
        标准化后处理
         fis.match('*.{js,tpl}', { postprocessor: fis.plugin('require-async')});
    * standard
         自定义标准化，可以自定义 uri、embed、require 等三种能力，可自定义三种语言能力的语法；
    * optimizer
         启用优化处理插件，并配置其属性
         fis.match('*.css', {optimizer: fis.plugin('clean-css')});
    * deploy
         解释：设置项目发布方式
         值类型：Array | fis.plugin | function
         默认值：fis.plugin('local-deliver')
         说明：编译打包后，新增发布阶段，这个阶段主要决定了资源的发布方式，而这些方式都是以插件的方式提供的。比如你想一键部署到远端或者是把文件打包到 Tar/Zip 又或者是直接进行 Git 提交，都可以通过设置此属性，调用相应的插件就能搞定了。
         用法：假设项目开发完后，想部署到其他机器上，我们选择 http 提交数据的方式部署
         fis.match('**', {
              deploy: fis.plugin('http-push', {
                  receiver: 'http://target-host/receiver.php', // 接收端
                  to: '/home/work/www' // 将部署到服务器的这个目录下
              })
          })
 * ::package
 *      fis.match('::package', { packager: fis.plugin('map')});packager:打包阶段插件设置时必须分配给所有文件,表示当 packager 阶段所有的文件都分配某些属性
 * ::image
 *      fis.match('::image', {useHash: true});// 所有被标注为图片的文件添加 hash
 * ::text
 *      fis.match('::text', { useHash: false});// 所有被标注为文本的文件去除 hash
 * :js
 *      fis.match('index.html:js', { optimizer: fis.plugin('uglify-js')});//匹配模板中的内联 js，支持 isHtmlLike 的所有模板 压缩 index.html 内联的 js
 * :css
 *      fis.match('index.html:css', {optimizer: fis.plugin('clean-css')});//匹配模板中内联 css，支持 isHtmlLike 的所有模板,压缩 index.html 内联的 css
 *
 */




// npm install -g fis-parser-less-2.x
fis.match('**/*.less', {
    rExt: '.css', // from .less to .css
    parser: fis.plugin('less-2.x', {
        // fis-parser-less-2.x option
    })
});
/*
    压缩资源
*/
// 清除其他配置，只保留如下配置
fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});
