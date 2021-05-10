import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//懒加载
const Login = () =>
  import ('components/Login')
const Home = () =>
  import ('views/home/Home')
const Welcome = () =>
  import ('components/Welcome')
const Users = () =>
  import ('components/user/Users')
const Rights = () =>
  import ('components/power/Rights')
const Roles = () =>
  import ('components/power/Roles')
const Cate = () =>
  import ('components/goods/Cate')
const Params = () =>
  import ('components/goods/Params')
const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params }
    ]
  }
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