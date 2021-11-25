const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
/**
 * interface obj {
 *      name: string
 *      age: number
 *      sex: string
 *      [properties]: any
 * }
 * 
 */
let userMsg = {}

readline.question(`你叫什么名字?`, name => {
    userMsg.name = name
    readline.question(`你的年龄多大?`, age => {
        userMsg.age = age
        readline.question(`你的性别?`, sex => {
            userMsg.sex = sex
            console.log(userMsg);
            readline.close()
        })
    })
})

