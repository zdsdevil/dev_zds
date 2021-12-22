const Service = require('egg').Service

class CommentService extends Service {
  // create======================================================================================================>
  async create(payload) {
    const { ctx, service } = this
    const _id = ctx.state.user.data._id
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    payload.auth = _id;
    return this.ctx.model.Comment.create(payload)
  }

  // destroy======================================================================================================>  
  async destroy(_id) {
    const { ctx, service } = this
    const comment = await ctx.service.comment.find(_id)
    if (!comment) {
      ctx.throw(404, 'comment not found')
    }
    return ctx.model.Comment.findByIdAndRemove(_id)
  }

  // update======================================================================================================>
  async update(_id, payload) {
    const { ctx, service } = this
    const comment = await ctx.service.comment.find(_id)
    if (!comment) {
      ctx.throw(404, 'comment not found')
    }
    return ctx.model.Comment.findByIdAndUpdate(_id, payload)
  }

  // addChild======================================================================================================>
  async addChild(payload) {
    const { ctx, service } = this
    const comment = await ctx.service.comment.find(payload.pId)
    if (!comment) {
      ctx.throw(404, 'comment not found')
    }
    if (comment.children) {
        comment.children.push(payload.childId);
    }
    let _payload = {
        children: comment.children ? comment.children : [payload.childId]
    }
    return ctx.model.Comment.findByIdAndUpdate(payload.pId, _payload)
  }

  // show======================================================================================================>
  async show(_id) {
    const comment = await this.ctx.service.comment.find(_id)
    if (!comment) {
      this.ctx.throw(404, 'comment not found')
    }
    return this.ctx.model.Comment.findById(_id);
  }

  //获取博客文章所有评论数量
  async getCommentCountByBlogId(id) {
    let count = await this.ctx.model.Comment.count({blogId: id}).exec()
    return count;
  }

  // index======================================================================================================>
  async index(payload) {
    const { pageNo, pageSize, isPaging } = payload
      let res = []
      let res2 = [];
      let children = []
    let childrenCount = [];
    let count = 0
    let skip = ((Number(pageNo)) - 1) * Number(pageSize || 10)
    let query = {};
    if (payload.blogId) {
      query.blogId = payload.blogId
    }
    let search = JSON.stringify(query) === "{}" ? false : true;
    if(isPaging) {
      if(search) {
        res = await this.ctx.model.Comment.find(query).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Comment.find({}).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Comment.count({}).exec()
      }
    } else {
        res = await this.ctx.model.Comment.find({ reply_sno: { $exists: false }, ...query }).populate('auth').skip(skip).limit(Number(pageSize)).sort({ createdAt: 1 }).lean()
        let promises = res.map(item => {
          return this.ctx.model.Comment.find({
              root_commentId: item._id
          }).populate('auth').populate('reply_userId').limit(20).lean()
        });
        let promises2 = res.map(item => {
          return this.ctx.model.Comment.count({
                root_commentId: item._id
          })
        });

      children = await Promise.all(promises)
      childrenCount = await Promise.all(promises2)
    }
    let data = res.map((item,index) => {
      let jsonObject = Object.assign({}, item);
      let childrenData = children[index].map(item => {
        return {
          id: item._id,
          createdAt: this.ctx.helper.formatTime(item.createdAt),
          content: item.content,
          dislike: item.dislike,
          like: item.like,
          blogId: item.blogId,
          reply_sno: item.reply_sno,
          reply_commentId: item.reply_commentId,
          root_commentId: item.root_commentId,
          auth: {
            id: item.auth._id,
            username: item.auth.username
          },
          reply_user: {
            id: item.reply_userId._id,
            username: item.reply_userId.username
          }
        }
      })
      return {
        id: jsonObject._id,
        children: childrenData,
        childrenCount: childrenCount[index],
        createdAt: this.ctx.helper.formatTime(jsonObject.createdAt),
        content: jsonObject.content,
        dislike: jsonObject.dislike,
        reply_sno: jsonObject.reply_sno,
        like: jsonObject.like,
        blogId: jsonObject.blogId,
        reply_commentId: jsonObject.reply_commentId,
        root_commentId: jsonObject.root_commentId,
        auth: {
          id: jsonObject.auth._id,
          username: jsonObject.auth.username
        }
      }
    })

    return { count: count, data: data, pageSize: Number(pageSize), currentPage: Number(pageNo) }
  }

  async children(id) {
    let res = []
    res = await this.ctx.model.Comment.find({root_commentId: id}).populate('auth').sort({ createdAt: 1 }).lean()
    let data = res.map((e,i) => {
      const jsonObject = Object.assign({}, e)
      jsonObject.key = i
      jsonObject.id = e._id
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { data: data }
  }

    
  // removes======================================================================================================>
  async removes(values) {
    return this.ctx.model.Comment.remove({ _id: { $in: values } })
  }

  // Commons======================================================================================================>
  async find(id) {
    return this.ctx.model.Comment.findById(id)
  }

}

module.exports = CommentService