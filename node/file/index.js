const fs = require('fs');
const fsPromise = require('fs/promises')
const path = require('path');
/***
 * 1.读取文件所有内容
 *    1.获取一个目录下的所有文件名。
 *    2.循环读取文件名 - 保存到数组。
 * 2.进行格式文件转换
 *    1.根据数组读取文件名改格式
 */

// 使用 stats.isFile() 和 stats.isDirectory() 判断文件是否目录或文件。

/**
 * readdirSync 读取文件目录返回子目录
 * 必须存在对应文件路径 - 否则报错
 * fs.lstatSync(fileName).isFile() 判断是否文件
 */

const isFile = fileName => { // 判断是否是文件
    return fs.statSync(fileName).isFile()
}

const isFiles = fileName => { // 判断是否是文件夹
    try {
        return fs.statSync(fileName).isDirectory()
    } catch (err) {
        return false
    }
}

function startReadDir(url) {
    const readFileArr = [];
    (function startReadFile(filePath) {
        fs.readdirSync(filePath).forEach(fileName => {
            const url = path.join(filePath, fileName)
            if (isFile(url)) {
                readFileArr.push(url)
            } else {
                startReadFile(url)
            }
        })
    })(url)
    return readFileArr
}

function readFile(arrs) {
    const imgs = ['.jpg']
    arrs.forEach(file => {
        if (imgs.indexOf(path.extname(file)) === -1) {
            return false
        }
        const url = path.join(path.dirname(file), "/asdas/asd", path.basename(file, path.extname(file)) + ".png");
        const parentPath = path.join(path.dirname(url));
        const callback = () => {
            //创建一个可写流
            const rs = fs.createReadStream(file);
            const ws = fs.createWriteStream(url);
            rs.pipe(ws);

            // const rs = fs.readFile(file, "utf-8", (err, data) => {
            //     fs.writeFile(url, data, err => {
            //         console.log(err);
            //     })
            // })
        }

        if (!isFiles(path.resolve(__dirname, parentPath))) {
            createDir(parentPath, null, (err) => {
                //创建一个可读流
                callback()
            })
        } else {
            callback()
        }

    })
}

/**
 * 一直查询到最顶层文件夹
 */
function createDir(url, options = null, callback = () => {}) {
    const parentPath = path.join(path.dirname(url));
    if (!isFiles(parentPath)) {
        createDir(parentPath)
    }
    fs.mkdir(url, options, callback)
}

readFile(startReadDir("./images/"))

/***
 * fsPromis通过promise封装一层
 */
const {
    opendir,
    open,
    access,
    chmod
} = fsPromise;
/**
 * chmod 设置文件权限
 * access 检查文件是否存在，以及 Node.js 是否有权限访问。
 * @param {string} 参数一
 * @param {string | integer} 参数二mode fs.constants文件的描述变量
 */
(async function () {
    await chmod('./images/480X762.jpg', fs.constants.R_OK);
    try {
        const res = await access('./images/480X762.jpg', fs.constants.R_OK | fs.constants.W_OK);
        console.log(res);
    } catch (err) {
        console.error(err);
    }
})()