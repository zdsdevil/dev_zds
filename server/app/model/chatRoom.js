module.exports = app => {
    const mongoose = app.mongoose
    const ChatRoomSchema = new mongoose.Schema({
        room_id: { type: String, required: true },
        room_name: { type: String, required: true },
        room_logo: { type: String, required: true },
        master: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        notice: { type: String },
        createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('ChatRoom', ChatRoomSchema)
}