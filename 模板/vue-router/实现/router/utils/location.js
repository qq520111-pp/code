export function extend(a, b) {
    for (const key in b) {
        a[key] = b[key]
    }
    return a
}

// 解析path，返回path、query、hash部分
export function parsePath(path) {
    let hash = ''
    let query = ''
    // 存在#，则hash为#到结尾部分；path暂时为开头到#处
    const hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
        hash = path.slice(hashIndex)
        path = path.slice(0, hashIndex)
    }
    // 当存在?，代表存在qs，则截取出query；path为开头到?的部分
    const queryIndex = path.indexOf('?')
    if (queryIndex >= 0) {
        query = path.slice(queryIndex + 1)
        path = path.slice(0, queryIndex)
    }

    return {
        path,
        query,
        hash
    }
}

// 解析path
export function resolvePath(
    relative,
    base,
    append
) {
    const firstChar = relative.charAt(0)
    if (firstChar === '/') {
        return relative
    }

    if (firstChar === '?' || firstChar === '#') {
        return base + relative
    }

    const stack = base.split('/')

    // remove trailing segment if:
    // - not appending
    // - appending to trailing slash (last segment is empty)
    if (!append || !stack[stack.length - 1]) {
        stack.pop()
    }

    // resolve relative path
    const segments = relative.replace(/^\//, '').split('/')
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (segment === '..') {
            stack.pop()
        } else if (segment !== '.') {
            stack.push(segment)
        }
    }

    // ensure leading slash
    if (stack[0] !== '') {
        stack.unshift('')
    }

    return stack.join('/')
}

export function normalizeLocation(
    raw, // 原始location，一个string，或者是一个已经格式化后的location
    current, // 当前路由对象
    append, // 是否是追加模式
    router // VueRouter实例
) {
    let next = typeof raw === 'string' ? {
        path: raw
    } : raw
    // named target
    // 已经格式化过，直接返回
    if (next._normalized) {
        return next
    } else if (next.name) {
        // 处理命名形式，例如{name:'Home',params:{id:3}}
        next = extend({}, raw)
        const params = next.params
        if (params && typeof params === 'object') {
            next.params = extend({}, params)
        }
        return next
    }

    // relative params
    // 处理{params:{id:1}}相对参数形式跳转
    if (!next.path && next.params && current) {
        next = extend({}, next)
        next._normalized = true
        const params = extend(extend({}, current.params), next.params)
        // 提取当前route的字段做为next的字段，因为相对参数形式，只有params，必须借助current提取一些字段
        if (current.name) {
            // 命名形式
            next.name = current.name
            next.params = params
        } else if (current.matched.length) {
            // path形式，从匹配记录中提取出当前path并填充参数
            const rawPath = current.matched[current.matched.length - 1].path
            // TODO: 方法没有
            next.path = fillParams(rawPath, params, `path ${current.path}`)
        } else if (process.env.NODE_ENV !== 'production') {
            warn(false, `relative params navigation requires a current route.`)
        }
        return next
    }
    // 处理path形式跳转，例如{path:'/test',query:{test:3}}
    // 解析path
    const parsedPath = parsePath(next.path || '')
    const basePath = (current && current.path) || '/'
    const path = parsedPath.path ?
        resolvePath(parsedPath.path, basePath, append || next.append) :
        basePath
    // 解析query
    const query = parsedPath.query
    /* resolveQuery(
        parsedPath.query,
        next.query, // 额外需要追加的qs
        router && router.options.parseQuery // 支持传入自定义解析query的方法
    ) */
    // 解析hash
    let hash = next.hash || parsedPath.hash
    if (hash && hash.charAt(0) !== '#') {
        hash = `#${hash}`
    }

    return {
        _normalized: true, // 标识已经格式化过
        path,
        query,
        hash
    }
}