const Service = require('egg').Service

class ChatService extends Service {
    // create======================================================================================================>
    async create(payload) {
        const { ctx, service } = this
        return this.ctx.model.Chat.create(payload)
    }

    // index======================================================================================================>
    async index(payload) {
        const { pageNo, pageSize, isPaging } = payload
        let res = []
        let query = {};
        if (payload.blogId) {
            query.blogId = payload.blogId
        }
        res = await this.ctx.model.Chat.find({ ...query }).populate('user_info').sort({ createdAt: 1 }).lean()

        return { data: res }
    }

    // Commons======================================================================================================>
    async find(id) {
        return this.ctx.model.Comment.findById(id)
    }

}

module.exports = ChatService