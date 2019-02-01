/**
 * Initialises new Vue Application
 */

import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import VueRouter from 'vue-router';
import store from './store.js';

require('uikit/dist/js/uikit');
require('uikit/dist/js/uikit-icons');

Vue.config.productionTip = false;

Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
