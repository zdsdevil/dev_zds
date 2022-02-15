import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/handle";
import store from "./store";
import { VueAxios } from './utils/request'
import comment from '@/components/commentComponent'
import './core/lazy_use'
import './core/use'
import './utils/filter'
import VueSocketIO from 'vue-socket.io'
// import "./socket-io/index.js";

import "./assets/css/index.less";
import "./utils/vue.prototype";
import Icon from "vue-svg-icon/Icon.vue";
import Message from "@/components/Message/index.js";
Vue.use(Message.register);
Vue.component("icon", Icon);

Vue.config.productionTip = false;

Vue.use(VueAxios)
Vue.use(new VueSocketIO({
  // debug: true,
  // connection: 'http://127.0.0.1:80', //服务端连接
  connection: 'http://124.222.47.163:7001', //服务端连接
  reconnection: true,
  reconnectionAttempts: Infinity,
  options: {
    autoConnect: false
  }
}))
Vue.component('comment', comment)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
