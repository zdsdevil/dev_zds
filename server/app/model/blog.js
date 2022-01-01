module.exports = app => {
    const mongoose = app.mongoose
    const BlogSchema = new mongoose.Schema({
      title: { type: String, unique: true, required: true },
      subTitle: { type: String },
      tags: { type: Array },
      auth: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
      content: { type: String },
      abstract: { type: String, required: true },
      MdContent: { type: String },
      star: { type: Number, default: 0 },
      readTimes: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('Blog', BlogSchema)
  }