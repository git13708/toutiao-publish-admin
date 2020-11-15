/**
 * 全局通信总线
 * 呼叫中心
 * 作用:可以让任何组件之间相互通信
 */
import Vue from 'vue'

export default new Vue()

// 假设 a组件要给b组件发送数据

// b组件注册通信的事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('自定义事件名称', (data)={
//   // 处理函数
// })

// a组件发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称', 可选的数据)

// 注意: 通信的两端所使用的事件名称必须一致,否则是无效的

// 反之,如果 b 要给 a 发送数据
// 那肯定就是 a 注册事件, b 来发布
