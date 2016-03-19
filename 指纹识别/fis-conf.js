//npm install -g fis-parser-sass
//文件指纹，唯一标识一个文件。
// 在开启强缓存的情况下，如果文件的 URL 不发生变化，无法刷新浏览器缓存。
// 一般都需要通过一些手段来强刷缓存，一种方式是添加时间戳，每次上线更新文件，给这个资源文件的 URL 添加上时间戳。
//而 FIS3 选择的是添加 MD5 戳，直接修改文件的 URL，而不是在其后添加 query。

//对 js、css、png 图片引用 URL 添加 md5 戳，配置如下；
fis.match('*.{js,css,png}', {
    useHash: true//boolean 型
});

