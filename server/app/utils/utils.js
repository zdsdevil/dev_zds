/**
 * @desc 当前当前时间戳/1000  按秒计算
 * @params lastTimespace  传入上次时间戳则计算时间与现在的插值
 * @returns 
 */
const getTimeSpace = (lastTimespace = 0) => {
    const nowSpace = Math.round(new Date().getTime() / 1000)
    return  lastTimespace ? nowSpace - lastTimespace : nowSpace
 }

module.exports = {
    getTimeSpace
}