import router from './index'
import store from "../store"


router.beforeEach((to, from, next) => {
    store.commit('setShowPageLoadScrollBar', true)
    next()
})
router.afterEach((to, from) => {
    store.commit('setShowPageLoadScrollBar', false)
})

export default router