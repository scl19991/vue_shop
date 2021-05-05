import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//懒加载
const Login = () =>
  import ('../components/Login')
const Home = () =>
  import ('../views/Home')
const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

//挂载路由导航守卫
//to 将要访问的路径
//from 从哪个路径跳转而来
//next是函数 表示放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
    //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router