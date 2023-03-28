
import { generateFilePath } from '@nextcloud/router'

import Vue from 'vue'
import App from './App.vue'
import TabMenu from './components/TabMenu.vue'
import TabMenuCB from './components/TabMenuCB.vue'
import ResultCB from './components/ResultCB.vue'
import SearchMenu from './components/SearchMenu.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/apps/kmaapp/quanlyhoso', component: TabMenu },
    { path: '/apps/kmaapp/timkiem', component: SearchMenu },
    {
      path: '/apps/kmaapp/quanlyhoso/:kma_uid',
      component: TabMenuCB,
      props: true
    },
  ]
})

router.push('apps/kmaapp/quanlyhoso')

// eslint-disable-next-line
__webpack_public_path__ = generateFilePath(appName, '', 'js/')

// bind to window
Vue.mixin({ methods: { t, n } })
//Vue.prototype.t = t
////Vue.prototype.n = n
// Vue.prototype.OC = OC
// Vue.prototype.OCA = OCA
// eslint-disable-next-line camelcase
// Vue.prototype.oc_userconfig = oc_userconfig

export default new Vue({
  router,
  el: '#content',
  render: h => h(App),
})
