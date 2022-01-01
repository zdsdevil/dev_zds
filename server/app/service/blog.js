const Service = require('egg').Service

class BlogService extends Service {
  // create======================================================================================================>
  async create(payload) {
    const { ctx, service } = this
    const id = ctx.state.user.data._id
    payload.auth = id;
    return this.ctx.model.Blog.create(payload)
  }

  // destroy======================================================================================================>  
  async destroy(_id) {
    const { ctx, service } = this
    const blog = await ctx.service.blog.find(_id)
    if (!blog) {
      ctx.throw(404, 'blog not found')
    }
    return ctx.model.Blog.findByIdAndRemove(_id)
  }

  // update======================================================================================================>
  async update(_id, payload) {
    const { ctx, service } = this
    const blog = await ctx.service.blog.find(_id)
    if (!blog) {
      ctx.throw(404, 'blog not found')
    }
    return ctx.model.Blog.findByIdAndUpdate(_id, payload)
  }

  async read(_id) {
    const { ctx, service } = this
    const blog = await ctx.service.blog.find(_id)
    if (!blog) {
      ctx.throw(404, 'blog not found')
    }
    return ctx.model.Blog.findByIdAndUpdate(_id, { readTimes: blog.readTimes + 1 })
  }

  async prev(_id) {
    const { ctx, service } = this
    const blog = await ctx.model.Blog.find({ '_id': { '$lt': _id } }).sort({ _id: -1 }).limit(1).lean();
    if (!blog) {
      ctx.throw(404, 'blog not found')
    }
    return blog;
  }

  async next(_id) {
    const { ctx, service } = this
    const blog = await ctx.model.Blog.find({ '_id': { '$gt': _id } }).sort({ _id: 1 }).limit(1).lean();
    if (!blog) {
      ctx.throw(404, 'blog not found')
    }
    return blog;
  }

  // show======================================================================================================>
  async show(_id) {
    const blog = await this.ctx.service.blog.find(_id)
    if (!blog) {
      this.ctx.throw(404, 'blog not found')
    }
    let blogData = await this.ctx.model.Blog.findById(_id).lean();
    blogData.id = blogData._id;
    blogData.commentCount = await this.ctx.model.Comment.count({ blogId: _id }).exec();
    blogData.createdAt = this.ctx.helper.formatTime(blogData.createdAt);
    delete blogData._id;
    return blogData;
  }

  // index======================================================================================================>
  async index(payload) {
    const { pageNo, pageSize } = payload
    let res = []
    let count = 0
    let skip = ((Number(pageNo)) - 1) * Number(pageSize || 10)
    let query = {};
    if (payload.auth) {
      query.auth = payload.auth
    }
    if (payload.title) {
      query.title = payload.title
    }
    let search = JSON.stringify(query) === "{}" ? false : true;
    if(search) {
      res = await this.ctx.model.Blog.find(query).skip(skip).populate('auth').limit(Number(pageSize)).sort({ createdAt: -1 }).lean()
      count = res.length
    } else {
      res = await this.ctx.model.Blog.find({}).skip(skip).populate('auth').limit(Number(pageSize)).sort({ createdAt: -1 }).lean()
      count = await this.ctx.model.Blog.count({}).exec()
    }
    let promises = res.map(item => {
      return this.ctx.model.Comment.count({blogId: item._id}).exec()
    });
    let commentCount = await Promise.all(promises)
    // 整理数据源 -> Ant Design Pro
    let data = res.map((item,index) => {
      let newObj = Object.assign({}, item);
      newObj.id = newObj._id
      newObj.createdAt = this.ctx.helper.formatTime(newObj.createdAt)
      newObj.auth = {
        id: newObj.auth._id,
        username: newObj.auth.username,
        avatar: newObj.auth.avatar
      }
      newObj.commentCount = commentCount[index]
      delete newObj._id;
      delete newObj.__v;
      return newObj
    })

    return { count: count, data: data, pageSize: Number(pageSize), currentPage: Number(pageNo) }
  }

  // removes======================================================================================================>
  async removes(values) {
    return this.ctx.model.Blog.remove({ _id: { $in: values } })
  }

  // Commons======================================================================================================>
  async find(id) {
    return this.ctx.model.Blog.findById(id)
  }

}

module.exports = BlogService