import Vue from 'vue'
import App from './App.vue'
import router from './router'
import  Icon from 'vue-svg-icon/Icon'


Vue.component('Icon',Icon);
Vue.config.productionTip = false

Vue.prototype.$bus=new Vue({

})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
