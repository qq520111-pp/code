export function stringifyQuery(obj) {
    const res = obj ? Object.keys(obj).map(key => {
        const val = obj[key]

        if (val === undefined) {
            return ''
        }

        if (val === null) {
            return encode(key)
        }

        if (Array.isArray(val)) {
            const result = []
            val.forEach(val2 => {
                if (val2 === undefined) {
                    return
                }
                if (val2 === null) {
                    result.push(encode(key))
                } else {
                    result.push(encode(key) + '=' + encode(val2))
                }
            })
            return result.join('&')
        }

        return encode(key) + '=' + encode(val)
    }).filter(x => x.length > 0).join('&') : null
    return res ? `?${res}` : ''
}
// 生成Route
export function createRoute(
    record,
    location,
    redirectedFrom,
    router
) {
    const stringifyQuery = router && router.options.stringifyQuery // 支持传入自定义序列化qs方法
    let query = location.query || {}
    try {
        query = clone(query) // location.query为引用值，避免相互影响，进行深拷贝
    } catch (e) {}
    // 生成Route
    const route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query,
        params: location.params || {},
        fullPath: getFullPath(location, stringifyQuery), // 完整path
        matched: record ? formatMatch(record) : [] // 获取所有匹配的路由记录
    }
    // 如果是从其它路由对重定向过来的，则需要记录重定向之前的地址
    if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
    }
    // 防止篡改
    return Object.freeze(route)
}
// 深拷贝
function clone(value) {
    if (Array.isArray(value)) {
        return value.map(clone)
    } else if (value && typeof value === 'object') {
        const res = {}
        for (const key in value) {
            res[key] = clone(value[key])
        }
        return res
    } else {
        return value
    }
}
// 获取完整path
function getFullPath({
        path,
        query = {},
        hash = ''
    },
    _stringifyQuery
) {
    const stringify = _stringifyQuery || stringifyQuery
    return (path || '/') + stringify(query) + hash
}
// 格式化匹配的路由记录，当一个路由记录匹配了，如果其还有父路由记录，则父路由记录肯定也是匹配的
// /foo/bar 匹配了，则其父路由对象 /foo 肯定也匹配了
function formatMatch(record) {
    const res = []
    while (record) {
        res.unshift(record) // 队列头添加，所以父record永远在前面，当前record永远在最后；在router-view组件中获取匹配的route record时会用到
        record = record.parent
    }
    return res
}
// the starting route that represents the initial state
export const START = createRoute(null, {
    path: '/'
})

// 判断target的path是否包含current的path，如果包含，则在非精准匹配时当前link要激活
export function isIncludedRoute(current, target) {
    return (
        current.path.replace(trailingSlashRE, '/').indexOf(
            target.path.replace(trailingSlashRE, '/')
        ) === 0 &&
        (!target.hash || current.hash === target.hash) &&
        queryIncludes(current.query, target.query)
    )
}

// 是否相同route
export function isSameRoute(a, b) {
    if (b === START) {
        return a === b
    } else if (!b) {
        return false
    } else if (a.path && b.path) {
        // path都存在，比较path、hash、query是否相同
        return (
            a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
            a.hash === b.hash &&
            isObjectEqual(a.query, b.query)
        )
    } else if (a.name && b.name) {
        // name都存在，比较name、hash、query、params是否相同
        return (
            a.name === b.name &&
            a.hash === b.hash &&
            isObjectEqual(a.query, b.query) &&
            isObjectEqual(a.params, b.params)
        )
    } else {
        return false
    }
}


function isObjectEqual(a = {}, b = {}) {
    // handle null value #1566
    if (!a || !b) return a === b
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) {
        return false
    }
    return aKeys.every(key => {
        const aVal = a[key]
        const bVal = b[key]
        // check nested equality
        if (typeof aVal === 'object' && typeof bVal === 'object') {
            return isObjectEqual(aVal, bVal)
        }
        return String(aVal) === String(bVal)
    })
}

function queryIncludes(current, target) {
    for (const key in target) {
        if (!(key in current)) {
            return false
        }
    }
    return true
}