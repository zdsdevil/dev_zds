const Controller = require('egg').Controller

class MusicCollectController extends Controller {
    // 收藏音乐
    async create() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.musicCollect.create(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取收藏音乐列表
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.musicCollect.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 删除单个收藏
    async destroy() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        await service.musicCollect.destroy(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }
}

module.exports = MusicCollectController
