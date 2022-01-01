const Controller = require('egg').Controller

class CommentController extends Controller {
    constructor(ctx) {
        super(ctx)
        this.createComment = {
            content: { type: 'string', required: true, allowEmpty: false }
        }
    }
    async create() {
        const { ctx, service } = this
        // 校验参数
        ctx.validate(this.createComment);
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.comment.create(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 删除评论
    async destroy() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        await service.comment.destroy(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }

    // 更新评论
    async update() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.comment.update(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 更新父评论子级
    async addChild() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.comment.addChild(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }
    
    // 获取所有评论(分页/模糊)
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.comment.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取所有子级评论(分页/模糊)
    async childrenComment() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        const res = await service.comment.children(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }
}

module.exports = CommentController
