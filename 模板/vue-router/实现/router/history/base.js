import {
    START
} from "../utils/route.js";
export const inBrowser = typeof window !== 'undefined'
export class History {
    constructor(router, base) {
        this.router = router
        // 格式化base，保证base是以/开头
        this.base = normalizeBase(base)
        // start with a route object that stands for "nowhere"
        this.current = START // 当前指向的route对象，默认为START；即from
    }

    listen(cb) {
        this.cb = cb
    }

    // 路由跳转
    transitionTo(
        location, // 原始location，一个url或者是一个Location interface(自定义形状，在types/router.d.ts中定义)
        onComplete, // 跳转成功回调
        onAbort // 跳转失败回调
    ) {
        const route = this.router.match(location, this.current) // 传入需要跳转的location和当前路由对象，返回to的Route
        // 确认跳转
        this.confirmTransition(
            route,
            () => { // onComplete，完成
                onComplete && onComplete(route) // 调用onComplete回调
            },
            err => { // onAbort，报错（取消）
                onAbort && onAbort(route) // 调用onComplete回调
            }
        )
    }

    updateRoute(route) {
        this.current = route // 更新current
        this.cb && this.cb(route)
    }

    confirmTransition(
        route,
        onComplete, // 跳转成功回调
        onAbort // 跳转失败回调
    ) {
        const current = this.current
        if (
            isSameRoute(route, current) &&
            route.matched.length === current.matched.length
        ) {
            return false
        }
        this.updateRoute(route)
        this.pending = route // 记录将要跳转的route，方便取消对比用
        onComplete && onComplete(route) // 调用onComplete回调
    }
}


// 格式化base，保证base地址是以/开头，尾部无/
function normalizeBase(base) {
    if (!base) {
        if (inBrowser) {
            // respect <base> tag
            const baseEl = document.querySelector('base')
            base = (baseEl && baseEl.getAttribute('href')) || '/'
            // strip full URL origin
            base = base.replace(/^https?:\/\/[^\/]+/, '')
        } else {
            base = '/'
        }
    }
    // make sure there's the starting slash
    if (base.charAt(0) !== '/') {
        base = '/' + base
    }
    // remove trailing slash
    return base.replace(/\/$/, '')
}

// 是否相同route
export function isSameRoute(a, b) {
    if (a.path === b.path) {
        // path都存在，比较path、hash、query是否相同
        return true
    }
    return false
}