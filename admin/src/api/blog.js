import request from '@/utils/request'

//获取blog列表
export function getBlogList(params) {
  return request({
    url: '/api/blogList',
    method: 'get',
    params
  })
}

//创建blog
export function createBlog(parameter) {
  return request({
    url: '/api/blog/create',
    method: 'post',
    data: parameter
  })
}

//更新
export function updateBlog(data) {
  return request({
    url: '/api/blog/' + data.id,
    method: 'put',
    data
  })
}

//删除blog
export function deleteBlog(id) {
  return request({
    url: '/api/blog/' + id,
    method: 'delete'
  })
}

//获取blog详情
export function getBlog(id) {
    return request({
      url: '/api/blog/' + id,
      method: 'get'
    })
}

//阅读
export function readBlog(id) {
  return request({
    url: '/api/blog/read/' + id,
    method: 'put'
  })
}

//获取下一篇
export function getNextBlog(id) {
  return request({
    url: '/api/blog/' + id + '/next',
    method: 'get'
  })
}