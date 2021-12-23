import router from './routers'
import store from '@/store'

const whiteList = ['/user/login','/user/register']
router.beforeEach((to, from, next) => {
  let userInfo = store.getters.userInfo;
  if (whiteList.indexOf(to.path) > -1) {
    next();
  } else {
    if ((!userInfo || !userInfo.id)) {
      store.dispatch('GetInfo').then(res => {
        next();
      })
    } else {
      next();
    }
  }
})