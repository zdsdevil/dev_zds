module.exports = app => {
  return async (ctx, next) => {
    ctx.socket.emit('message', this.packet)
    await next();
  };
};