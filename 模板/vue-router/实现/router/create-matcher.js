import {
    createRouteMap
} from "./create-route-map.js";
import {
    createRoute
} from "./utils/route.js";
import {
    normalizeLocation
} from "./utils/location.js";
export function createMatcher(
    routes, // 路由配置列表
    router // VueRouter实例
) {
    const {
        pathList,
        pathMap,
        nameMap
    } = createRouteMap(routes)

    function addRoute(routes) {
        createRouteMap(routes, pathList, pathMap, nameMap)
    }

    function match(raw, currentRoute, redirectedFrom) {
        const location = normalizeLocation(raw, currentRoute, false, router)
        if (location.name) {
            // TODO: 待写
            const record = nameMap[location.name]
            // 未找到路由记录，则创建一个空Route返回
            if (!record) return _createRoute(null, location)

        } else if (location.path) {
            location.params = {}
            // 遍历pathList，找到能匹配到的记录，然后生成Route
            for (let i = 0; i < pathList.length; i++) {
                const path = pathList[i]
                const record = pathMap[path]
                // 缺少 params[key.name || 'pathMatch'] = val
                if (location.path == path) {
                    // 找到匹配的路由记录后，生成对应Route
                    return _createRoute(record, location, redirectedFrom)
                }
            }
        }
        // no match
        return _createRoute(null, location)
    }

    function matchRoute(
        regex,
        path,
        params
    ) {
        const m = path.match(regex)

        if (!m) { // 无法匹配上
            return false
        } else if (!params) { // 符合正则 && params不存在，则表示可以匹配
            return true
        }
        // 符合正则 && params存在，需要对params进行正确赋值
        // path-to-regexp会将每个动态路由标记处处理成正则的一个组，所以i从1开始
        // 参考https://www.npmjs.com/package/path-to-regexp
        // const keys = [];
        // const regexp = pathToRegexp("/foo/:bar", keys);
        // regexp = /^\/foo\/([^\/]+?)\/?$/i
        // :bar就被处理成正则的一个组了
        // keys = [{ name: 'bar', prefix: '/', suffix: '', pattern: '[^\\/#\\?]+?', modifier: '' }]
        for (let i = 1, len = m.length; i < len; ++i) {
            const key = regex.keys[i - 1] // regex.keys返回匹配到的
            const val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i]
            if (key) {
                // Fix #1994: using * with props: true generates a param named 0
                params[key.name || 'pathMatch'] = val
            }
        }

        return true
    }

    function _createRoute(
        record,
        location,
        redirectedFrom
    ) {
        // 正常路由记录
        return createRoute(record, location, redirectedFrom, router)
    }
    return {
        match,
        addRoute,
    }
}