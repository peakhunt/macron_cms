import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/ChannelList',
      name: 'chnanel list',
      component: () => import('./views/ChannelList.vue'),
    },
    {
      path: '/AlarmList',
      name: 'alarm list',
      component: () => import('./views/AlarmList.vue'),
    },
    {
      path: '/IO',
      name: 'IO',
      component: () => import('./views/IO.vue'),
    },
    {
      path: '/CurrentAlarms',
      name: 'current alarms',
      component: () => import('./views/CurrentAlarms.vue'),
    },
    {
      path: '/TankList',
      name: 'tank list',
      component: () => import('./views/TankList.vue'),
    },
    {
      path: '/Vessel',
      name: 'Vessel',
      component: () => import('./views/Vessel.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
