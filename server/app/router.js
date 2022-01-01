'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  // role
  router.post('/api/role/create', controller.role.create)
  router.delete('/api/role/:id', controller.role.destroy)
  router.put('/api/role/:id', controller.role.update)
  router.get('/api/role/:id', controller.role.show)
  router.get('/api/RoleList', controller.role.index)
  router.delete('/api/role', controller.role.removes)
  router.resources('role', '/api/role', controller.role)

  // userAccess
  router.post('/api/login', controller.userAccess.login)
  router.get('/api/current', app.jwt, controller.userAccess.current)
  router.get('/api/logout', controller.userAccess.logout)
  router.put('/api/resetPsw', app.jwt, controller.userAccess.resetPsw)

  // user
  router.post('/api/user/create', controller.user.create)
  router.delete('/api/user/:id', controller.user.destroy)
  router.put('/api/user/:id', controller.user.update)
  router.get('/api/user/:id', controller.user.show)
  router.get('/api/userByUsername/:username', controller.user.show)
  router.get('/api/userList', controller.user.index)
  router.delete('/api/user', controller.user.removes)
  router.resources('user', '/api/user', controller.user)

  // upload
  router.post('/api/upload', controller.upload.create)
  router.post('/api/upload/url', controller.upload.url)
  router.post('/api/uploads', controller.upload.multiple)
  router.delete('/api/upload/:id', controller.upload.destroy)
  // router.put('/api/upload/:id', controller.upload.update)
  router.post('/api/upload/:id', controller.upload.update) // Ant Design Pro
  router.put('/api/upload/:id/extra', controller.upload.extra)
  router.get('/api/upload/:id', controller.upload.show)
  router.get('/api/upload', controller.upload.index)
  router.delete('/api/upload', controller.upload.removes)
  // router.resources('upload', '/api/upload', controller.upload)

  //blog
  router.post('/api/blog/create', app.jwt, controller.blog.create)
  router.delete('/api/blog/:id', controller.blog.destroy)
  router.put('/api/blog/:id', controller.blog.update)
  router.get('/api/blog/:id', controller.blog.show)
  router.get('/api/blogList', controller.blog.index)
  router.put('/api/blog/read/:id', controller.blog.read)
  router.get('/api/blog/:id/prev', controller.blog.prev)
  router.get('/api/blog/:id/next', controller.blog.next)

  //blog
  router.post('/api/comment/create', controller.comment.create)
  router.delete('/api/comment/:id', controller.comment.destroy)
  router.put('/api/comment/:id', controller.comment.update)
  router.put('/api/comment/addChild/:id', controller.comment.addChild)
  // router.get('/api/comment/:id', controller.comment.show)
  router.get('/api/comment/list', controller.comment.index)
  router.get('/api/comment/childrenComment/:id', controller.comment.childrenComment)
  
}
