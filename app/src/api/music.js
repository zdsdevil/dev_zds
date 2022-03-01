import request from '@/utils/request'

export function collectMusic(data) {
    return request({
        url: '/api/musicCollect/create',
        method: 'post',
        data
    })
}

export function removeMusic(id) {
    return request({
        url: '/api/musicCollect/remove/' + id,
        method: 'delete'
    })
}

export function musicCollectList(params) {
    return request({
        url: '/api/musicCollect/list',
        method: 'get',
        params
    })
}

export function search(params) {
    return request({
        url: '/api/music/search',
        method: 'get',
        params
    })
}

export function hot(params) {
    return request({
        url: '/api/music/hot',
        method: 'get',
        params
    })
}

