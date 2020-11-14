/**
 * 文章相关请求模块
 */
import request from '@/utils/request.js'

/**
 * 获取文章列表
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body参数使用 data 传
    // Query 参数使用 params 设置
    // Headers 参数使用headers 设置
    params
  })
}

/**
 * 获取文章频道数据
 */
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/**
 * 删除文章数据
 */
export const deleteArticle = articleId => {
  return request({
    method: 'POST',
    // 接口文档中写的路径参数需要在url中传递
    // 凡是看见接口路径中有 :xxx 格式字段,则需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 发表文章
 */
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true为草稿)
    },
    data
  })
}

/**
 * 修改文章
 */
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft // 是否存为草稿（true为草稿)
    },
    data
  })
}

/**
 * 获取指定文章
 */
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 修改文章评价状态
 */
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
