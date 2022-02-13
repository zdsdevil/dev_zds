import request from '@/utils/request'

export function history(params) {
  return request({
    url: '/api/chat/history',
    method: 'get',
    params
  })
}