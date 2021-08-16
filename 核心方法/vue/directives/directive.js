const obj = {
  countTimer(vNode, el) {
    const {
      value
    } = el;
    const element = vNode;
    startTimer(element, value)
  }
}

function startTimer(vNode, time) {
  countHandle(vNode, time)
}

function countHandle(vNode, count) {
  if (count <= 0) {
    console.log("end");
    vNode.innerHTML = "倒计时结束"
    return false
  }
  vNode.innerHTML = formatTime(count)
  setTimeout(() => {
    countHandle(vNode, --count)
  }, 1000)
}

function formatTime(count) {
  var d = 0,
    h = 0,
    m = 0,
    s = 0;
  if (count < 60) {
    return count
  }

  d = Math.floor(count / (60 * 60 * 24))
  h = Math.floor(count / (60 * 60) % 24)
  m = Math.floor(count / 60 % 60)
  s = Math.floor(count % 60)


  function tow(number) {
    return number < 10 ? "0" + number : number
  }
  return `${tow(d)} ${tow(h)}:${tow(m)}:${tow(s)}`
}

const directive = {
  install(Vue) {
    Vue.directive("count-timer", obj.countTimer)
  }
}