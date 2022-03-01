const Service = require('egg').Service

class MusicCollectService extends Service {
    // create======================================================================================================>
    async create(payload) {
        const { ctx, service } = this
        const id = ctx.state.user.data._id
        payload.music_collector = id
        return ctx.model.MusicCollect.create(payload)
    }

    // destroy======================================================================================================>  
    async destroy(_id) {
        const { ctx, service } = this
        const music = await ctx.model.MusicCollect.findById(_id)
        if (!music) {
            ctx.throw(404, 'music not found')
        }
        return ctx.model.MusicCollect.findByIdAndRemove(_id)
    }

    // index======================================================================================================>
    async index(payload) {
        const { ctx, service } = this
        const { pageNo, pageSize, isPaging } = payload
        const id = ctx.state.user.data._id
        payload.music_collector = id
        let res = []
        let query = {};
        res = await ctx.model.MusicCollect.find({ ...query }).populate('music_collector').sort({ createdAt: 1 }).lean()
        return { data: res }
    }
}

module.exports = MusicCollectService