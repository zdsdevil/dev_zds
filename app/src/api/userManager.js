import request from '@/utils/request'

//获取用户列表
export function getUserList(params) {
  return request({
    url: '/api/userList',
    method: 'get',
    params
  })
}

//创建账号
export function createUser(parameter) {
  return request({
    url: '/api/user/create',
    method: 'post',
    data: parameter
  })
}

//更新
export function updateUser(data) {
  return request({
    url: '/api/user/' + data.id,
    method: 'put',
    data
  })
}

//删除账号
export function deleteUser(id) {
  return request({
    url: '/api/user/' + id,
    method: 'delete'
  })
}

//获取角色列表
export function getRoleList(params) {
  return request({
    url: '/api/RoleList',
    method: 'get',
    params
  })
}

//创建角色
export function createRole(parameter) {
  return request({
    url: '/api/role/create',
    method: 'post',
    data: parameter
  })
}

//更新
export function updateRole(data) {
  return request({
    url: '/api/role/' + data.id,
    method: 'put',
    data
  })
}

//删除角色
export function deleteRole(id) {
  return request({
    url: '/api/role/' + id,
    method: 'delete'
  })
}

//修改密码
export function resetPsw(data) {
  return request({
    url: '/api/resetPsw',
    method: 'put',
    data
  })
}

