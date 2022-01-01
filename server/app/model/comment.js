module.exports = app => {
    const mongoose = app.mongoose
    const CommentSchema = new mongoose.Schema({
        blogId: { type: mongoose.Schema.Types.ObjectId, required: true },
        auth: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        avatar: { type: String },
        content: { type: String, required: true },
        like: { type: Number, default: 0 },
        dislike: { type: Number, default: 0 },
        children: { type: Array },
        root_commentId: { type: mongoose.Schema.Types.ObjectId }, //根级评论id
        reply_sno: { type: Number }, //评论层级
        reply_userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reply_commentId: { type: mongoose.Schema.Types.ObjectId }, //引用评论id
        nickname: { type: String },
        email: { type: String },
        website: { type: String },
        createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('Comment', CommentSchema)
}