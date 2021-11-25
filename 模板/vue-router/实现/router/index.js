import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from "./my-router";
import Home from '../components/HelloWorld.vue'
import Test from '../components/Test.vue'
import xxx from '../components/xxx.vue'
import yyy from '../components/yyy.vue'
Vue.use(VueRouter)
const routes = [{
    path: '/home',
    name: 'HelloWorld',
    components: Home
}, {
    path: '/test',
    name: 'test',
    components: Test,
    children: [{
        path: 'xxx',
        name: 'xxx',
        components: xxx,
    }, {
        path: 'yyy',
        name: 'yyy',
        components: yyy
    }]
}]
const router = new VueRouter({
    routes
})
export default router