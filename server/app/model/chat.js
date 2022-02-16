module.exports = app => {
    const mongoose = app.mongoose
    const ChatSchema = new mongoose.Schema({
      user_id: { type: mongoose.Schema.Types.ObjectId, required: true},
      user_info: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
      message_content: { type: String, required: true },
      message_type: { type: String, required: true },
      room_id: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('Chat', ChatSchema)
  }