import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/handle";
import store from "./store";
import { VueAxios } from './utils/request'
import comment from '@/components/commentComponent'
import './core/lazy_use'
import './utils/filter'
Vue.config.productionTip = false;

Vue.use(VueAxios)

Vue.component('comment', comment)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
