const path = require("path");
/**
 * dirname: 获取文件的父文件夹。
 * basename: 获取文件名部分。
 * extname: 获取文件的扩展名。
 * 
 */
const notes = '/test/index.js'

console.log(path.dirname(notes)); // /test
console.log(path.basename(notes)); // index.js
console.log(path.extname(notes)); // .js

/**
 *  连接路径的两个或多个片段
 */
path.join()

/**
 * 获得相对路径的绝对路径计算
 */
path.resolve()

/**
 * path.parse() 方法返回一个对象，其属性表示 path 的重要元素。
 * @returns {object} 
    dir <string>
    root <string>
    base <string>
    name <string>
    ext <string>
 */
path.parse('/home/user/dir/file.txt');

/**
 * path.format() 方法从对象返回路径字符串。 这与 path.parse() 相反。
 * path.format(pathObject)
    dir <string>
    root <string>
    base <string>
    name <string>
    ext <string>
 */
const pathObject = {

}
 path.format(pathObject)