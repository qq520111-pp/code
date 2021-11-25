export default {
  name: 'RouterView',
  functional: true,
  render(h, context) {
    console.log(context, "=====> context");
    let {
      parent,
      data,
      children
    } = context
    data.routerView = true
    let depth = 0
    const route = parent.$route
    while (parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {}
      if (vnodeData.routerView) {
        depth++
      }
      parent = parent.$parent
    }
    const matched = route && route.matched[depth]
    const component = matched && matched.components
    return h(component, data, children)
  }
}