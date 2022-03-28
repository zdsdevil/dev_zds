import request from '@/utils/request'

//获取印记中文导航
export function getDoc(params) {
  return request({
    url: '/api/spider/getDoc',
    method: 'get',
    params
  })
}