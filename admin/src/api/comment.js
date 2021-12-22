import request from '@/utils/request'

//获取评论列表
export function getCommentList(params) {
  return request({
    url: '/api/comment/list',
    method: 'get',
    params
  })
}

//创建
export function createComment(parameter) {
  return request({
    url: '/api/comment/create',
    method: 'post',
    data: parameter
  })
}

//更新
export function updateComment(data) {
  return request({
    url: '/api/comment/' + data._id,
    method: 'put',
    data
  })
}

//更新
export function addChildComment(data) {
  return request({
    url: '/api/comment/addChild/' + data.pId,
    method: 'put',
    data
  })
}

//更新
export function getChildrenComments(id) {
  return request({
    url: '/api/comment/childrenComment/' + id,
    method: 'get'
  })
}

//删除
export function deleteComment(id) {
  return request({
    url: '/api/comment/' + id,
    method: 'delete'
  })
}

//获取详情
export function getComment(id) {
    return request({
      url: '/api/comment/' + id,
      method: 'get'
    })
  }