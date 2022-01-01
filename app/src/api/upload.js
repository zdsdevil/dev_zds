import request from '@/utils/request'

//上传单个文件
export function uploadSingleFile(data) {
  return request({
    url: '/api/upload',
    method: 'post',
    data
  })
}

//上传多个文件
export function uploadMultipleFile(data) {
  return request({
    url: '/api/uploads',
    method: 'post',
    data
  })
}