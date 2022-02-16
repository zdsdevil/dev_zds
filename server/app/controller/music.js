const Controller = require('egg').Controller

class MusicController extends Controller {
    // 创建聊天消息
    async create() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.chat.create(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取所有聊天消息
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.chat.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取所有热门歌曲
    async hot() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.music.hot(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }
    // 搜索歌曲
    async search() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.music.search(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }
}

module.exports = MusicController
