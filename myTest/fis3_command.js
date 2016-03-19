/**
 * Created by Administrator on 2015/8/17 0017.
 */
/**
 * 经过fis团队不断实践总结，我们发现支持前端开发所需要的编译能力 只有三种 ：
     资源定位：获取任何开发中所使用资源的线上路径；
     内容嵌入：把一个文件的内容(文本)或者base64编码(图片)嵌入到另一个文件中；
     依赖声明：在一个文本文件内标记对其他资源的依赖关
 *
 *
 * fis3 release
 * --->目录
  fis3 release -d
     构建发布(输出)目录
    不指定 -d 参数时，构建结果被发送到内置 Web Server 的根目录下。此目录可以通过执行以下命令打开。
    ---> fis3 server open
 *---> 文件监听
    fis3 release -w
    当启动文件监听时，修改文件时会构建发布，而且编译时增量的，编译花费时间少 ，按ctrl+c退出
 *
 * --->浏览器自动刷新
        fis3 release -wL
 *--->替代内置Server
     FIS3 内置了一个 Web Server 提供给构建后的代码进行调试。如果你自己启动了你自己的 Web Server 依然可以使用它们。
    假设你的 Web Server 的根目录是 /Users/my-name/work/htdocs，那么发布时只需要设置产出目录到这个目录即可。
     fis3 release -d /Users/my-name/work/htdocs
     如果想执行 fis3 release 直接发布到此目录下，可在配置文件配置；
     fis.match('*', {
      deploy: fis.plugin('local-deliver', {
        to: '/Users/my-name/work/htdocs'
      })
    })
 *--->发布到远端机器
    当我们开发项目后，需要发布到测试机（联调机），一般可以通过如 smb、ftp 等上传代码。
        FIS3 默认支持使用 HTTP 上传代码，首先需要在测试机部署上传接收脚本（或者服务），这个脚本非常简单，
        现在给出了 php 的实现版本，可以把它放到测试机上某个 Web 服务根目录，并且配置一个 url 能访问到即可。
    示例脚本是 php 脚本，测试机 Web 需要支持 PHP 的解析
    如果需要其他语言实现，请参考这个 php 脚本实现，如果嫌麻烦，我们提供了一个 node 版本的接收端https://github.com/fex-team/receiver
    假定这个 URL 是：http://cq.01.p.p.baidu.com:8888/receiver.php
    那么我们只需要在配置文件配置
     fis.match('*', {
      deploy: fis.plugin('http-push', {
        receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
        to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
      })
    })
 如果你想通过其他协议上传代码，请参考 deploy 插件开发 实现对应协议插件即可。http://fis.baidu.com/fis3/docs/api/dev-plugin.html#Deploy%20%E6%8F%92%E4%BB%B6
 当执行 fis3 release 时上传测试机器
 可能上传测试机是最后联调时才会有的，更好的做法是设置特定 media。
 // 其他配置
 ...
 fis.media('qa').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
    to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
  })
});

 fis3 release qa 上传测试机器
 fis3 release 产出到本地测试服务器根目录


 */


/**
 * fis3 server
 *
 *
 */

