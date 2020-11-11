/**
 * 用户相关请求模块
 */

import request from '@/utils/request.js'
// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // data用来设置POST请求体
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile',
    // 后端要求把需要授权的用户身份放到请求头中
    // axios可以通过header选项设置请求头
    headers: {
      // 属性名:Authorization 接口要求
      // 属性值:Bearer空格token数据
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzY1MzIwNDcsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.o4ZVyW1YA24Q-C1qhJeUSvMYH3hcNQZoPErv8WtXSIM'
    }
  })
}

// 修改用户信息
// export const updateUser = () => {
// }
