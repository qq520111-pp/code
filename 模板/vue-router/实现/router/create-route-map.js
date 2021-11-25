export function createRouteMap(
    routes,
    oldPathList,
    oldPathMap,
    oldNameMap
) {
    const pathList = oldPathList || []
    const pathMap = oldPathMap || Object.create(null)
    const nameMap = oldNameMap || Object.create(null)

    routes.forEach(route => {
        addRouteRecord(pathList, pathMap, nameMap, route)
    })

    return {
        pathList,
        pathMap,
        nameMap
    }
}

function addRouteRecord(
    pathList,
    pathMap,
    nameMap,
    route,
    parent
) {
    const {
        path,
        name
    } = route

    const normalizedPath = normalizePath(path, parent)

    const record = {
        path: normalizedPath,
        name,
        parent,
        components: route.components,
    }

    if (route.children) {
        route.children.forEach(child => {
            addRouteRecord(pathList, pathMap, nameMap, child, record)
        })
    }

    if (!pathMap[record.path]) {
        pathList.push(record.path)
        pathMap[record.path] = record
    }

    if (name) {
        if (!nameMap[name]) {
            nameMap[name] = record
        }
    }
}

function normalizePath(
    path, parent
) {
    if (path[0] === '/') return path
    if (parent == null) return path
    return cleanPath(`${parent.path}/${path}`)
}

function cleanPath(path) {
    return path.replace(/\/+/g, '/')
}