// 对象深拷贝
export const deepClone = (data) => {
  const type = getObjType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        obj[key] = deepClone(data[key])
      }
    }
  }
  return obj
}

// a标签下载文价
export const downLoadFn = (data, fileName) => {
  const b = new Blob([data])
  const url = URL.createObjectURL(b)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.target = '_blank'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    link.remove()
  }, 500)
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  const isFullscreen =
    document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  return isFullscreen
}

// 全屏方法
function fullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

// 浏览器退出全屏 
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}

// 向右移位
function shiftRight(number, digit) {
  digit = parseInt(digit, 10)
  const value = number.toString().split('e')
  return Number(`${value[0]}e${value[1] ? Number(value[1]) + digit : digit}`)
}

// 向左移位
function shiftLeft(number, digit) {
  digit = parseInt(digit, 10)
  const value = number.toString().split('e')
  return Number(`${value[0]}e${value[1] ? Number(value[1]) - digit : -digit}`)
}
// 金额到大写
export const digitUppercase = (n) => {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  const head = n < 0 ? '欠' : ''
  // eslint-disable-next-line no-param-reassign
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(shiftRight(n, 1 + i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  // eslint-disable-next-line no-param-reassign
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      // eslint-disable-next-line no-param-reassign
      n = Math.floor(shiftLeft(n, 1))
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
  )
}

// 获取url中的参数
export const getUrlParams = (url) => {
  let result = {
    url: '',
    params: {}
  };
  let list = url.split('?');
  result.url = list[0];
  let params = list[1];
  if (params) {
    let list = params.split('&');
    list.forEach(ele => {
      let dic = ele.split('=');
      let label = dic[0];
      let value = dic[1];
      result.params[label] = value;
    });
  }
  return result;
};

// 滚动到对应位置
scrollTop(el, from = 0, to, duration = 500, endCallback) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
}

// 千分位分割
const toThousand = (str) => String(str).replace(/\B(?=(\d{3})+\b)/g, ',');