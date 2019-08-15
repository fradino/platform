import Vue from 'vue'

import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import go from 'gojs';
import imageViewer from './components/imageViewer'


Vue.use(ElementUI)
Vue.use(imageViewer)

new Vue({
  el: '#app',
  render: h => h(App),
  store
})
