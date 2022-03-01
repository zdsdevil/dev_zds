const Controller = require('egg').Controller

class ChatRoomController extends Controller {
    // 创建聊天室
    async create() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.chatRoom.create(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取所有聊天消息
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.chatRoom.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取聊天室信息
    async show() {
        const { ctx, service } = this
        // 组装参数
        const { room_id } = ctx.params
        // 调用 Service 进行业务处理
        const res = await service.chatRoom.show(room_id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 更新聊天室信息
    async update() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        await service.chatRoom.update(id, payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }
}

module.exports = ChatRoomController
