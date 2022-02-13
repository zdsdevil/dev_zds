import request from '@/utils/request'

export function collectMusic(data) {
    return request({
        url: '/api/music/collectMusic',
        method: 'post',
        data
    })
}

export function removeCollect(data) {
    return request({
        url: '/api/music/removeCollect',
        method: 'post',
        data
    })
}

export function search(params) {
    return request({
        url: '/api/music/search',
        method: 'get',
        params
    })
}


export function collectList(params) {
    return request({
        url: '/api/music/collectList',
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

