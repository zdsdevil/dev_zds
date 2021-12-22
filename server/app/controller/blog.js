const Controller = require('egg').Controller

class BlogController extends Controller {
    constructor(ctx) {
        super(ctx)
        this.createBlog = {
            title: { type: 'string', required: true, allowEmpty: false },
            // content: { type: 'string', required: true, allowEmpty: false }
        }
    }
    async create() {
        const { ctx, service } = this
        // 校验参数
        ctx.validate(this.createBlog);
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.blog.create(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 删除单个blog
    async destroy() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        await service.blog.destroy(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }

    // 修改blog
    async update() {
        const { ctx, service } = this
        // 校验参数
        ctx.validate(this.createBlog)
        // 组装参数
        const { id } = ctx.params
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        await service.blog.update(id, payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }

    // 阅读
    async read() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        await service.blog.read(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }

    // 上一条
    async prev() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        const res = await service.blog.prev(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 下一条
    async next() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        const res = await service.blog.next(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取单个blog
    async show() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        const res = await service.blog.show(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 获取所有blog(分页/模糊)
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.blog.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 删除所选blog(条件id[])
    async removes() {
        const { ctx, service } = this
        // 组装参数
        // const payload = ctx.queries.id
        const { id } = ctx.request.body // {id: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
        const payload = id.split(',') || []
        // 调用 Service 进行业务处理
        const result = await service.blog.removes(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }
}

module.exports = BlogController
