import router from './routers'
import store from '@/store'

router.beforeEach((to, from, next) => {
  let userInfo = store.getters.userInfo;
  if (!userInfo || !userInfo.id) {
    store.dispatch('GetInfo').then(res => {
      next();
    })
  } else {
    next();
  }
})