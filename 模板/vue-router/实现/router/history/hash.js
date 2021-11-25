import {
    History
} from './base'
export class HashHistory extends History {
    constructor(router, base) {
        super(router, base)

        ensureSlash()
    }
    // this is delayed until the app mounts
    // to avoid the hashchange listener being fired too early
    // 修复#725;https://github.com/vuejs/vue-router/issues/725
    // 因为如果钩子函数 beforeEnter 是异步的话, beforeEnter 钩子就会被触发两次. 因为在初始化时, 如果此时的 hash 值不是以 / 开头的话就会补上 #/, 这个过程会触发 hashchange 事件, 就会再走一次生命周期钩子, 也就意味着会再次调用 beforeEnter 钩子函数.
    setupListeners() {
        const router = this.router
        // 添加事件监听
        window.addEventListener('popstate', // 优先使用popstate
            () => {
                if (!ensureSlash()) {
                    return
                }
                this.transitionTo(getHash(), route => {})
            }
        )
    }

    // 获取当前location
    getCurrentLocation() {
        return getHash()
    }

    // 根据push字段，确定是新增还是替换一条历史记录
    ensureURL(push) {
        const current = this.current.fullPath
        if (getHash() !== current) {
            push ? pushHash(current) : replaceHash(current)
        }
    }
}
/**
 * 确保url是以/开头
 */
function ensureSlash() {
    const path = getHash()
    if (path.charAt(0) === '/') {
        return true
    }
    replaceHash('/' + path)
    return false
}

function getUrl(path) {
    const href = window.location.href
    const i = href.indexOf('#')
    const base = i >= 0 ? href.slice(0, i) : href
    return `${base}#${path}`
}

// 替换hash记录
function replaceHash(path) {
    window.location.replace(getUrl(path))
}
// 新增hash记录
function pushHash(path) {
    window.location.hash = path
}
/**
 * 获取#之后内容
 * http://localhost:8080/#/center/test?subjectCode=03&phaseCode=04&hwType=6
 * /center/test?subjectCode=03&phaseCode=04&hwType=6
 */
export function getHash() {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    let href = window.location.href
    const index = href.indexOf('#')
    // empty path
    if (index < 0) return ''

    href = href.slice(index + 1)
    // decode the hash but not the search or hash
    // as search(query) is already decoded
    // https://github.com/vuejs/vue-router/issues/2708
    // 不decode qs和hash之后的内容
    const searchIndex = href.indexOf('?')
    if (searchIndex < 0) {
        const hashIndex = href.indexOf('#')
        if (hashIndex > -1) {
            href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex)
        } else href = decodeURI(href)
    } else {
        href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex)
    }

    return href
}