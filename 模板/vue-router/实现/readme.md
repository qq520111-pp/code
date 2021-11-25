## 手写vueRouter - 结合vueRouter源码

### 思路

> 编写vueRouter源码时，我们看见功能是根据浏览器得hash值 得变化，切换出不同得页面组件。可以推断是vueRouter是通过监听浏览器得hash值变化去做对应得功能。

1. 使用vueRouter - 配置项

   ```javascript
   Vue.use(VueRouter) // 安装初始化vueRouter
   const router = new VueRouter({ // 生成vueRouter配置并且导出，挂在vue实例上
       mode: "hase",
       routes:[{
               path: '/home',
               name: 'HelloWorld',
               components: Home
           },
           {
               path: '/test',
               name: 'test',
               components: Test,
               children: [{
                       path: 'xxx',
                       name: 'xxx',
                       components: xxx,
                   },
                   {
                       path: 'yyy',
                       name: 'yyy',
                       components: yyy
                   }
               ]
           }
       ]
   })
   ```
   这里由用户去操作生成对应配置文件

   1. 安装初始化vueRouter
   2. 生成vueRouter配置
   3. 把vueRouter实例挂在vue实例上

   > 通过上述问题可以看见vue是调用use去初始化vueRouter方法，调用vue。use内部会主动去调用install方法把Vue传进去。

   在vueRouter得install方法里面大致做了这几件事

   1. 把生成得vueRouter实例挂载到vue得各个组件上
   2. 创建响应式对象（$router、$route）
   3. 注册router-view和router-link组件



