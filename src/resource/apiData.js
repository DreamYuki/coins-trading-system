// const request = require("request");  // request已于2020.2.11被废弃，使用更好的got替代
// const domain = require("domain");    // 域在node官方说明中已弃用
// const d = domain.create();
const got = require("got");
// const got = require("/usr/local/lib/node_modules/got");
const sleep = require('../sleep');
const coinNames = require("../../config/coins/coinName");
// const forever = require("forever");


/* 参与交易的币种 */
let datas = {}
datas["coins"] = [
  ...coinNames["main"],
  ...coinNames["store"],
];
/**
 * 公共API-获取K线数据-时间粒度下，近200条数据，20次/2s
 * 时间粒度 60 180 300 900 1800 3600 7200 14400 21600 43200 86400 604800 2678400 8035200 16070400 31536000
 * 返回数组嵌套数组
 * time 	String 	开始时间0
 * open 	String 	开盘价格1
 * high 	String 	最高价格2
 * low 	    String 	最低价格3
 * close 	String 	收盘价格4
 * volume 	String 	交易量5
 */
async function requestData(coin, time_level) {
  let temp = `https://www.okexcn.com/api/spot/v3/instruments/${coin}-USDT/candles?granularity=${time_level}`;
//   console.log(temp);
  try {
      got.TimeoutError
      const response = await got(temp);
      if (response.statusCode == "200") {
          // 请求间隔时间无序化
          //   sleep(Math.random()*200)
          const atrrbute = coin + time_level;
          datas[atrrbute] = JSON.parse(response.body);
      }
  } catch (error) {
      console.log("网络中断，稍后重启");
      //   限制连续请求，减少服务器Rejection
        console.log(error);
      sleep(Math.random() * 5000);
  }
}

// requestData("BTC", 60);
/* 输出流 */
setInterval(() => {
  try {
    // 选中币种1、3、15、60分钟的K线数据
    datas["coins"].forEach((element) => {
      element = element.trim();
      requestData(element, 60);
      requestData(element, 180);
      requestData(element, 900);
      requestData(element, 3600);
    });
    // console.log(datas);
    exports.datas = datas;
  } catch (error) {
    sleep(Math.random() * 5000);
  }
  // 综合间隔控制在2000左右
}, 2000) 



// let std;
// // requestData("BTC", 60);
// function apistd() {
//   /* 输出流 */
//   std = setInterval(() => {
//     try {
//       // 1、3、15、60分线数据
//       datas["coins"].forEach(async (element) => {
//         // element = element.trim();
//         // requestData(element, 60);
//         // requestData(element, 180);
//         await requestData(element, 900);
//         // requestData(element, 3600);
//         await requestData(element, 86400);
//       });
//         console.log(datas);
//       exports.datas = datas;
//     } catch (error) {
//         console.log(error);
//       sleep(Math.random() * 5000);
//     }
//   }, 2000); //综合间隔控制在2000左右
// }

// setInterval(() => {
//   clearInterval(std);
//   apistd();
// }, 30 * 60 * 1000);
