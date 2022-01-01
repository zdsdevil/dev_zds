import request from '@/utils/request'

//获取用户列表
export function getUserById(id) {
    return request({
      url: '/api/user/' + id,
      method: 'get'
    })
}
  
export function getUserByUsername(username) {
    return request({
      url: '/api/userByUsername/' + username,
      method: 'get'
    })
  }