import SocketIO from "socket.io-client";
import VueSocketIoExtended from "vue-socket.io-extended";
import Vue from "vue";

const url = "http://127.0.0.1:7001";
const socket = SocketIO(url, {
  debug: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  autoConnect: false,
});
Vue.use(VueSocketIoExtended, socket);
