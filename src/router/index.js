/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
// import Vue from 'vue'
// import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

// Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/loginview',
    component: _import('common/loginview'),
    name: 'loginview',
    meta: { title: '登录' },
    children: [
      { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '用户登录' } },
      { path: '/register', component: _import('common/register'), name: 'register', meta: { title: '注册' } }
    ]
  },
  { path: '/activate', component: _import('common/activate'), name: 'activate', meta: { title: '激活' } }

]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('common/mainIndex'),
  name: 'index',
  redirect: { name: 'home' },
  meta: { title: '主页' },
  children: [
    { path: '/home', component: _import('common/home'), name: 'home', meta: {title: '首页'}},
    { path: '/analysis', component: _import('common/dataAnalysis'), name: 'dataAnalysis', meta: {title: '数据分析'}},
    { path: '/popularize', component: _import('common/popularize'), name: 'popularize', meta: {title: '推广管理'}},
    { path: '/addIdea', component: _import('common/addIdea'), name: 'addIdea', meta: { title: '新建创意' } },
    { path: '/editIdea', component: _import('common/editIdea'), name: 'editIdea', meta: { title: '编辑创意' } },
    { path: '/finance', component: _import('common/finance'), name: 'finance', meta: { title: '财务管理' } },
    { path: '/selectPutTime', component: _import('common/selectPutTime'), name: 'selectTime', meta: { title: '投放时段' } },
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    // console.log(token)
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      // this.$router.push({ name: 'login' })
      router.push({ name: 'login' })
    }
    next()
  }
}

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  // base:'/dist/',
  // base:'/dsp/',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})


/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    // console.log(mainRoutes.children)
    // console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
