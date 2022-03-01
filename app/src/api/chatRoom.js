import request from '@/utils/request'

//创建房间
export function createRoom(data) {
  return request({
    url: '/api/chatRoom/create',
    method: 'post',
    data
  })
}

//获取房间列表
export function getChatRooms(params) {
    return request({
      url: '/api/chatRoom/list',
      method: 'get',
      params
    })
}

//获取房间信息
export function getChatRoomInfo(room_id) {
  return request({
    url: '/api/chatRoom/' + room_id,
    method: 'get'
  })
}

//更新房间信息
export function updateChatRoom(data) {
  return request({
    url: '/api/chatRoom/' + data.id,
    method: 'put',
    data
  })
}
