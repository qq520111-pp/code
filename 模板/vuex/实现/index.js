var _Vue = null;
var vuexMutations = Object.create(null);
var vuexActions = Object.create(null);
class Store {
    constructor(options) {
        const state = options.state || {}
        const mutations = options.mutations || {}
        const actions = options.actions || {}
        const getters = options.getters || {};
        this.state = _Vue.observable(state); // 生成响应式数据

        Object.keys(mutations).forEach(key => {
            vuexMutations[key] = (state, ...options) => {
                return mutations[key].call(this, state, ...options)
            }
        })

        Object.keys(actions).forEach(key => {
            vuexActions[key] = (context, ...options) => {
                return actions[key].call(this, context, ...options)
            }
        })

        this.getters = Object.create(null);
        Object.keys(getters).forEach(key => {
            const self = this;
            Object.defineProperty(this.getters, key, {
                get() {
                    return getters[key].call(this, self.state)
                }
            })
        })
    }

    commit(key, ...options) {
        return vuexMutations[key](this.state, ...options)
    }

    dispatch(key, ...options) {
        const context = {
            commit: this.commit,
            state: this.state
        }
        return new Promise((resolve, reject) => {
            try {
                resolve(vuexActions[key](context, ...options))
            } catch (error) {
                reject(error)
            }
        })
    }
}


function install(Vue) {
    _Vue = Vue
    _Vue.mixin({
        beforeCreate() {
            if (this.$options.store1) {
                _Vue.prototype.$store1 = this.$options.store1
            }
        }
    })
}

function mapState(stateArr) {
    const mapStates = {}
    stateArr.forEach(stateName => {
        mapStates[stateName] = function () {
            return this.$store.state[stateName]
        }
    })
    return mapStates
}

export default {
    Store,
    install,
    mapState
}