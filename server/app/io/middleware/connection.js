const room = "default_room";

module.exports = () => {
  return async (ctx, next) => {
    // 权限校验通过
    // ctx.socket.emit('message', '校验通过');
    // 加入房间
    ctx.socket.join(room);
    // 放行
    await next();
    console.log('断开连接');
  }
};