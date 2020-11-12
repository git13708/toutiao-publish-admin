
/**
 * 项目的启动入口
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载Element组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

// 引入vue-amap
import VueAMap from 'vue-amap'

// 全局注册Element 组件库
Vue.use(ElementUI)
// 全局注册vue-amap组件库
Vue.use(VueAMap)

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'f7c0a3c38202cd6e3ec31275c30eb4d8',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.15'
})

Vue.config.productionTip = false

// 创建vue根实例
// 把router配置到根实例中
// 通过render方法把App根组件渲染到#app入口节点
new Vue({
  router,
  render: h => h(App)
  // el: '#app' 等价天$mount('#app')
}).$mount('#app')
