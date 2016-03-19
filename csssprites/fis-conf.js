/*FIS3 构建会对 CSS 中，路径带 ?__sprite 的图片进行合并。
为了节省编译的时间，分配到 useSprite: true 的 CSS 文件才会被处理。*/

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
    spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});