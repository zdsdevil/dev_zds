import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '@/views/home/index')
  },
  {
    path: '/rain',
    name: 'rain',
    component: () => import(/* webpackChunkName: "rain" */ '@/views/rain/index')
  },
  {
    path: '/blogger/:username',
    name: 'blogger',
    redirect: 'blogger/:username/list',
    component: () => import(/* webpackChunkName: "blogger" */ '@/views/blogger/index'),
    children: [{
      path: 'list',
      name: 'articleList',
      component: () => import(/* webpackChunkName: "articleList" */ '@/views/article/list')
    },{
      path: 'detail/:articleId',
      name: 'articleDetail',
      component: () => import(/* webpackChunkName: "articleDetail" */ '@/views/article/detail'),
    }]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () { // 页面刷新后回到顶部
    return { x: 0, y: 0}
  }
});

export default router;
