var contain = document.getElementById("app");
var ctx = contain.getContext("2d")
var width = 500, height = 500
var arrX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
var arrY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
var xH = width / arrX.length
var yH = height / arrY.length
var xCenter = Math.floor(arrX.length / 2) * xH, yCenter = Math.floor((arrY.length) / 2) * yH;
var test1 = { A: { x: 250, y: 100 }, B: { x: 250, y: 200 }, C: { x: 300, y: 150 } };

var eleW = 10, eleH = 10;
/**
 * 绘制格子
 *    let arrX = [0,1,2,3,4,5,6,7,8,9,10]
 *    let arrY = [0,1,2,3,4,5,6,7,8,9,10]
 *    let totalArr = [{x:0,y:0}]
 * 坐标系
 *    1. x轴 (0, 5) => (10, 5)
 *    2. y轴 (5, 0) => (5, 10)
 * 绘制成图形
 *     可拖拽
 *     显示对应坐标位置
 *     绘制三个点连线成闭合三角形
 *     绘制三个的div圆点模拟三角形三个顶点
 *     
 */
createTriangle(test1)

/**
 * 创建三角形三个顶点 A,B,C
 * 传入三个顶点 
 * {     
 *      A: { x: 250, y: 100 }, 
 *      B: { x: 250, y: 200 },
 *      C: { x: 300, y: 150 } 
 * };
 */

function createTriangle(obj) {
    var A = document.createElement('div')
    var B = document.createElement('div')
    var C = document.createElement('div')
    A.className = 'dot'
    B.className = 'dot'
    C.className = 'dot'
    let x = eleW / 2, y = eleH / 2;
    A.style.top = obj.A.y - y + 'px'
    A.style.left = obj.A.x - x + 'px'
    B.style.top = obj.B.y - y + 'px'
    B.style.left = obj.B.x - x + 'px'
    C.style.top = obj.C.y - y + 'px'
    C.style.left = obj.C.x - x + 'px'
    contain.parentNode.appendChild(A)
    contain.parentNode.appendChild(B)
    contain.parentNode.appendChild(C)

    EventListener(A, 'A', obj)
    EventListener(B, 'B', obj)
    EventListener(C, 'C', obj)
}

/**
 *  参数: target 传入拖拽元素,  拖动点坐标key(A/B/C) ,
 *  功能: div移动，重新绘制坐标 
 */

function EventListener(target, key, obj) {

    target.addEventListener('mousedown', function (e) {
        var endX = 0, endY = 0
        var moveFunction = function (e1) {
            let chaX = e1.clientX - e.clientX
            let chaY = e1.clientY - e.clientY
            let x = (obj[key].x + chaX) //拖动点x坐标
            let y = (obj[key].y + chaY) //拖动点x坐标
            endX = x + eleW / 2;
            endY = y + eleH / 2;
            x = Math.min(width - eleW, x)
            x = Math.max(0, x)
            y = Math.min(height - eleH, y)
            y = Math.max(0, y)
            target.style.left = x + "px"
            target.style.top = y + "px"

            let newObj = Object.assign({}, obj, {
                [key]: {
                    x: endX, y: endY
                }
            })
            ctx.clearRect(0, 0, 500, 500)
            startDraw()
            drawTriangle(newObj)
        }

        var upFunction = function (e2) {
            obj[key].x = endX
            obj[key].y = endY
            document.removeEventListener('mousemove', moveFunction)
            document.removeEventListener('mouseup', upFunction)
        }
        document.addEventListener('mousemove', moveFunction);
        document.addEventListener('mouseup', upFunction)
    })
}

// A.addEventListener('mousemove')

var Xobj = {
    startX: 0,
    startY: yCenter,
    endX: arrX.length * xH,
    endY: yCenter
}

var Yobj = {
    startX: xCenter,
    startY: 0,
    endX: xCenter,
    endY: arrY.length * yH
}

drawCanvas(Xobj)
drawCanvas(Yobj)

function startDraw() {
    let lineXY = getDrawLine()
    drawXY(lineXY)
}

function drawXY(lineXY) {
    lineXY.forEach(item => {
        // console.log(item);
        drawCanvas(item)
    })
}

function drawCanvas(obj, color = "white") {
    ctx.beginPath();//开启新路径
    ctx.moveTo(obj.startX, obj.startY);
    ctx.lineTo(obj.endX, obj.endY);
    ctx.strokeStyle = color;//绘制原色
    ctx.lineWidth = 1;//绘制线宽
    ctx.stroke();
}

function getDrawLine() {
    let lineArr = []
    arrX.forEach((x, i) => {
        lineArr.push({
            startX: arrX[i] * xH,
            endX: arrX[i] * xH,
            startY: 0,
            endY: (arrY.length) * yH
        })
    })
    arrY.forEach((y, j) => {
        lineArr.push({
            startY: arrY[j] * yH,
            endY: arrY[j] * yH,
            startX: 0,
            endX: (arrX.length) * xH
        })
    })
    return lineArr
}

function drawTriangle(obj, color = "white") {
    let { A, B, C } = obj;
    ctx.beginPath();//开启新路径
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(A.x, A.y);
    ctx.fillStyle = color;//绘制原色
    ctx.fill();
}
//坐标系
startDraw()
//画三角形
drawTriangle(test1)