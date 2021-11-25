/**
 * 1. 初始install和vueRouter类
 * 2. 根据routes传进来，去生成对应匹配match方法
 * 3. 根据平台环境生成对应的history会有一个基类base（核心方法是transitionTo）
 * 4. 注册对应组件
 */
import {
    createMatcher
} from "./create-matcher.js";
import {
    HashHistory
} from "./history/hash.js";
import View from './components/view.js'

class VueRouter {
    constructor(options) {
        this.mode = options.mode || "hash"
        this.options = options
        this.routes = options.routes || [] //你传递的这个路由是一个数组表
        this.matcher = createMatcher(options.routes || [], this) // match 匹配未写

        // 根据不同mode，实例化不同history实例
        switch (this.mode) {
            case 'hash':
                this.history = new HashHistory(this, options.base, this.fallback)
                break
            default:
                if (process.env.NODE_ENV !== 'production') {
                    assert(false, `invalid mode: ${mode}`)
                }
        }
    }
    // 获取匹配的路由对象
    match(
        raw,
        current,
        redirectedFrom
    ) {
        return this.matcher.match(raw, current, redirectedFrom)
    }

    init(app) {
        const history = this.history
        if (history instanceof HashHistory) {
            // 若是HashHistory，在调用父类的transitionTo方法后，并传入onComplete、onAbort回调
            const setupHashListener = () => {
                // 调用HashHistory.setupListeners方法，设置hashchange监听
                // 在 route 切换完成之后再设置 hashchange 的监听,
                // 修复https://github.com/vuejs/vue-router/issues/725
                // 因为如果钩子函数 beforeEnter 是异步的话, beforeEnter 钩子就会被触发两次. 因为在初始化时, 如果此时的 hash 值不是以 / 开头的话就会补上 #/, 这个过程会触发 hashchange 事件, 就会再走一次生命周期钩子, 也就意味着会再次调用 beforeEnter 钩子函数.
                history.setupListeners()
            }
            history.transitionTo(
                history.getCurrentLocation(),
                setupHashListener, // transitionTo的onComplete回调
                setupHashListener // transitionTo的onAbort回调
            )
        }

        this.history.listen((route) => {
            app._route = route
        })
    }
}

VueRouter.install = function (Vue) {
    // 新增代码
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.router) { // 如果是根组件
                this._routerRoot = this; //把当前实例挂载到_root上
                this._router = this.$options.router;
                this._router.init(this) // 初始化VueRouter实例，并传入Vue根实例
                // 响应式定义_route属性，保证_route发生变化时，组件(router-view)会重新渲染
                Vue.util.defineReactive(this, '_route', this._router.history.current)
            } else { //如果是子组件
                this._routerRoot = this.$parent && this.$parent._routerRoot
            }
        }
    })

    // 在原型上注入$router、$route属性，方便快捷访问
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router
        }
    })

    Object.defineProperty(Vue.prototype, '$route', {
        // 每个组件访问到的$route，其实最后访问的都是Vue根实例的_route
        get() {
            return this._routerRoot._route
        }
    })

    // 注册router-view、router-link全局组件
    Vue.component('RouterView', View)
}

export default VueRouter