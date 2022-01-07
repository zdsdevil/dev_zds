// import Vue from 'vue'
// import Router from 'vue-router'
// import { constantRouterMap } from '@/config/router.config'

// // hack router push callback
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

// Vue.use(Router)

// export default new Router({
//   mode: 'history',
//   routes: constantRouterMap
// })


import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, blogAppRouterMap, asyncRouterMap } from '@/config/router.config'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/admin/' : process.env.BASE_PATH,
  routes: constantRouterMap.concat(blogAppRouterMap).concat(asyncRouterMap)
})