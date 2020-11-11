/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'

// 之前是这样的
// axios.defaults.baseURL= 'https://api.example.com';

// 我们可能有这样的需求:
// 例如有多个不同路径的请求接口
// http://127.0.0.1:3000
// http://127.0.0.1:4000

// 复制了一个axios,不同的axios实例可以有不同的配置
// 而且不会相互冲突
// 复制出来的axios和axios本身的功能一模一样
const req1 = axios.create()
req1.defaults.baseURL = 'http://127.0.0.1:3000'

const req2 = axios.create()
req1.defaults.baseURL = 'http://127.0.0.1:4000'

// 完整写法
req1({
  method: 'GET',
  url: 'xxx'
})

// 快捷写法
req1.get('xxx')
req2.post('xxx')

// 创建一个 axios 实例,说白了就是复制了一个axios
// 我们通过这个实例云发请求,把需要的配置配置给这个实例来发请求
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn' // 请求的基础路径
})

// 请求拦截器

// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载request模块
// import request from 'request.js'
