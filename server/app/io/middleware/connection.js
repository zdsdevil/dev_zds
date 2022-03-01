const room = "888";

module.exports = () => {
  return async (ctx, next) => {
    let { app, socket } = ctx
    const nsp = app.io.of('/');
    // 权限校验通过
    // socket.emit('message', '校验通过');
    // 加入房间
    socket.join(room);
    socket.curRoomId = room;
    // 放行
    await next();
    let curRoomId = socket.curRoomId;
    let userId = app[curRoomId].clientIdMap[socket.id]
    delete app[curRoomId].onlineUserInfo[userId]
    socket.leave(curRoomId);
    nsp.to(curRoomId).emit('refreshOnlineUser', app[curRoomId].onlineUserInfo)
    console.log('断开连接');
  }
};