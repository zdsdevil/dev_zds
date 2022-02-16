// import { Column, Entity } from 'typeorm';
// import { BaseEntity } from 'src/common/entity/baseEntity';

// @Entity({ name: 'tb_music' })
// export class MusicEntity extends BaseEntity {
//   @Column({ length: 300, comment: "歌曲专辑" })
//   music_album: string;

//   @Column({ length: 300, comment: "歌曲名称" })
//   music_name: string;

//   @Column({ unique: true, comment: "歌曲mid" })
//   music_mid: number;

//   @Column({ comment: "歌曲时长" })
//   music_duration: number;

//   @Column({ length: 300, comment: "歌曲作者" })
//   music_singer: string;

//   @Column({ comment:"是否推荐到热门歌曲 1:是 -1:不是", default: -1})
//   is_recommend: number;
// }


module.exports = app => {
    const mongoose = app.mongoose
    const MusicSchema = new mongoose.Schema({
      music_album: { type: String }, //歌曲专辑
      music_name: { type: String, required: true }, //歌曲名称
      music_mid: { type: String, required: true }, //歌曲mid
      music_duration: { type: Number, required: true }, //歌曲时长
      music_artist: { type: String, required: true }, //歌曲作者
      music_pic120: { type: String }, //歌曲图片
      is_recommend: {type: Number, default: -1 }, //是否推荐到热门歌曲 1:是 -1:不是
      createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('Music', MusicSchema)
  }