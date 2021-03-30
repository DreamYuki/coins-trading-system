 /*
 必要时彻底暂停执行
 */
 module.exports = function (milliSeconds) {
    var StartTime = new Date().getTime();
    let i = 0;
    while (new Date().getTime() < StartTime + milliSeconds);
}