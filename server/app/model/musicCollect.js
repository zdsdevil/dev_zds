module.exports = app => {
    const mongoose = app.mongoose
    const MusicCollectSchema = new mongoose.Schema({
      music_album: { type: String }, //歌曲专辑
      music_name: { type: String, required: true }, //歌曲名称
      music_mid: { type: String, required: true }, //歌曲mid
      music_duration: { type: Number, required: true }, //歌曲时长
      music_artist: { type: String, required: true }, //歌曲作者
      music_pic120: { type: String }, //歌曲图片
      music_collector: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
      is_recommend: {type: Number, default: -1 }, //是否推荐到热门歌曲 1:是 -1:不是
      createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('MusicCollect', MusicCollectSchema)
  }