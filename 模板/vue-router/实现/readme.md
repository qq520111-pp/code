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

   ### 在vueRouter得install方法里面大致做了这几件事

   > 这些都是等到vue组件生成才会执行，因为通过mixins添加进去

   1. 把生成得vueRouter实例挂载到vue得各个组件上

      > 挂载根实例时，会去调用init方法跟创建一个router-view得响应式数据（_route 指向history的current）后面会讲到。

   2. 创建响应式对象（$router、$route）

   3. 注册router-view和router-link组件

   ### 生成vueRouter配置

   1. 解析传入routes（pathList，pathMap，nameMap）

      > this.matcher = createMatcher(options.routes || [], this):{ addroutes, match }   **核心方法** 
      >
      > addroutes（动态添加路由）
      >
      > createRouteMap **核心方法** 
      >
      > match（匹配当前路由）

   2. 根据mode判断出路由history方法
   
      > history会创建一个基类base，通过继承的形式在子类实现不同环境不同的功能。
      >
      > history内部维护一个**current**属性保存当前的**route对象**，以及会有一个**transitionTo**方法来启动并且开启监听hash的变化从而更新**current**的值。**内部更新时会通过发布订阅的形式更新一个router-view定义好的响应式数据从而更新视图（_route）**
   
      ### 在写到这里的时候会有几个关键方法，罗列出来。
   
      1. createMatcher
   
         > 返回addRouter（动态添加路由）、match（匹配path）
   
      2. createRouteMap 
   
         > 该方法会返回pathList，pathMap，nameMap等三种数组分别记录，路径数组、路径映射对象、组件名字的映射对象。映射的对象是解析routes的结果 - record。
   
      3. match
   
         > 传入当前path和当前current，会去匹配解析出route根据route的path去匹配pathMap获取到record，调用**createRoute**赋值给current
   
      4. createRoute
   
         > 返回一个描述path信息的对象，传入当前的record、current，其中一个**matched**属性涉及到router-view深度遍历相关。matched保存的是父级到子级的数组。
   
      5. transitionTo
   
         > 获取最新route，更新current和_route（router-view的响应式对象）两者指向一致。
   
         
   
      

