const Service = require('egg').Service

class ChatRoomService extends Service {
    // create======================================================================================================>
    async create(payload) {
        const { ctx, service } = this
        return this.ctx.model.ChatRoom.create(payload)
    }

    // index======================================================================================================>
    async index(payload) {
        const { pageNo, pageSize, isPaging } = payload
        let res = []
        let query = {};
        if (payload.master) {
            query.master = payload.master
        }
        res = await this.ctx.model.ChatRoom.find({ ...query }).populate('master').sort({ createdAt: 1 }).lean()
        return { data: res }
    }

    // show======================================================================================================>
    async show(room_id) {
        const chatRoom = await this.ctx.model.ChatRoom.find({ room_id }).lean()
        if (!chatRoom.length) {
            this.ctx.throw(404, 'chatRoom not found')
        }
        return chatRoom[0];
    }
    // update======================================================================================================>
    async update(_id, payload) {
        const chatRoom = await this.ctx.model.ChatRoom.findById(_id).lean()
        if (!chatRoom) {
            this.ctx.throw(404, 'chatRoom not found')
        }
        return this.ctx.model.ChatRoom.findByIdAndUpdate(_id, payload)
      }
}

module.exports = ChatRoomService