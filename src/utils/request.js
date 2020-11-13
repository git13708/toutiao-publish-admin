/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 之前是这样的
// axios.defaults.baseURL= 'https://api.example.com';

// 我们可能有这样的需求:
// 例如有多个不同路径的请求接口
// http://127.0.0.1:3000
// http://127.0.0.1:4000

// 复制了一个axios,不同的axios实例可以有不同的配置
// 而且不会相互冲突
// 复制出来的axios和axios本身的功能一模一样
// const req1 = axios.create()
// req1.defaults.baseURL = 'http://127.0.0.1:3000'

// const req2 = axios.create()
// req1.defaults.baseURL = 'http://127.0.0.1:4000'

// 完整写法
// req1({
//   method: 'GET',
//   url: 'xxx'
// })

// 快捷写法
// req1.get('xxx')
// req2.post('xxx')

// 创建一个 axios 实例,说白了就是复制了一个axios
// 我们通过这个实例云发请求,把需要的配置配置给这个实例来发请求
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 请求的基础路径
  // 定义后端返回原始数据的处理
  // 参数 data 就是后端返回的原始数据(未经处理的JSON格式数据)
  transformResponse: [function (data) {
    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
    // 后端返回的数据可能不是JSON格式字符串
    // 如果不是的话,那么 JSONbig.parse 调用就会报错
    // 所以我们使用try-catch来捕获异常,处理异常的发生
    try {
      // 如果转换成功,则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败了,则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  // 任何请求会经过这里
  // config是当前请求相关的配置信息对象
  // config是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息,则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 然后我们就可以在允许请求出去之前定制统一业务功能处理
    // 例如:统一的设置token

    // 当这里return config 之后请求才会真正的发出去
    return config
  },
  // 请求失败,会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载request模块
// import request from 'request.js'
