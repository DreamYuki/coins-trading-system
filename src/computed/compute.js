const Datas = require("../resource/apiData");
const page = require("../resource/pageControl");
const sleep = require("../sleep");
const stdout = require("../stdout");

// 时间粒度Boll带
const boll_1min = {};
const boll_3min = {};
const boll_15min = {};
// 交易信号
const exchange = {};
// 秒速涨幅
const secondSpeed = {};
// 上秒价格
const lastSecondPrice = {};
// 交易模式
let model = "";
// 交易计时
let timeTaker = 0;
// 止损做T的币种
let coinT = null;

// 首次载入现价
setTimeout(() => {
  Datas["datas"]["coins"].forEach((element) => {
    const temp_3min = element + 180;
    lastSecondPrice[element] = Datas["datas"][temp_3min][0][4];
  });
}, 10000);

// 交易决策
setInterval(() => {
  try {
    Datas["datas"]["coins"].forEach((element) => {
      // 每一个币种的15分钟BOLL线
      const temp_15min = element + 900;
      //   const temp_3min = element + 180;
      //   const temp_15min = element + 900;

      // 单个币种K线数据
      const arr_15min = Datas["datas"][temp_15min];
      //   const arr_3min = Datas["datas"][temp_3min];
      //   const arr_15min = Datas["datas"][temp_15min];

      // 20长度的MA20队列
      let queueMA20_15min = MAs(20, 20, arr_15min);
      //   let queueMA20_3min = MAs(20, 20, arr_3min);
      //   let queueMA20_15min = MAs(20, 20, arr_15min);

      // 最近收盘价格，从尾部压入最新元素，结束后，头部元素最新
      let _MA20_15min = MA(20, arr_15min);
      //   let _MA20_3min = MA(20, arr_3min);
      //   let _MA20_15min = MA(20, arr_15min);

      let _BOLL_15min = BOLL(_MA20_15min, queueMA20_15min);
      //   let _BOLL_3min = BOLL(_MA20_3min, queueMA20_3min);
      //   let _BOLL_15min = BOLL(_MA20_15min, queueMA20_15min);

      const atrrbute_15 = element + 900;

      //   const atrrbute_3 = element + 180;
      //   const atrrbute_15 = element + 900;

      boll_15min[atrrbute_15] = _BOLL_15min;
      //   boll_3min[atrrbute_3] = _BOLL_3min;
      //   boll_15min[atrrbute_15] = _BOLL_15min;

      /*
        交易方案2————针对BTC、ETH主流币
        1、只以1分钟K线为基准；
        2、最低价触及Boll下轨，按不高于下一分钟的收盘价买入；
        3、最高价*1.002触及Boll上轨时————按此刻的，买入价*1.001、卖出价*0.999，且buyPrice < sellPrice * 0.995的保本且盈利作为卖出条件。

     */

      const price = Number(arr_15min[0][4]);
      const high = Number(arr_15min[0][2]);
      const low = Number(arr_15min[0][3]);
      //key为币种，data为交易信号，默认为null
      exchange[element] = [null, 0];

      //   // 涨速 - 这里理论是2秒更新一次的数据，以此为标准换算。单位‰
      //   secondSpeed[element] = (
      //     ((price / Number(lastSecondPrice[element]) - 1) * 1000) /
      //     2
      //   ).toFixed(2);
      //   lastSecondPrice[element] = price;

      //  已经买入后只对买入币种判断，减少不必要的性能消耗
      if (
        (page["intentTemp"] === "买入" ||
          page["intentTemp"].indexOf("开") !== -1) &&
        page["intentCoin"] === element
      ) {
        // 成本价 = 成交价 ×（1+手续费率）[手续费一律按最高0.1%算]
        // 保本价 = 现价 ×（1-手续费率）
        let basePrice =
          Number(page["cost"].replace(/[^\d.]/g, "").trim()) * 1.001;
        let sellPrice = price * 0.999;

        if (high * 1.008 - Number(_BOLL_15min[0]) >= 0) {
          // if (high) { /* 测试卖出 */
          // 盈利下交易
          if (sellPrice * 0.995 > basePrice) {
            // if (sellPrice) {    /* 测试卖出 */
            // 注意卖出价不是保本价！
            exchange[element] = ["卖出", price];
          }
          // 亏损时，做T止损
          if (coinRate <= -1) {
            exchange[element] = "卖出";
            // 仅针对这个币种做T
            coinT = element;
          }
        }

        // TODO 持仓时间
        // TODO 持续盈利模式-达到卖出条件时，通过涨速判断是否继续持仓

        // 单次交易盈亏输出
        exports.coinRate = ((price / basePrice - 1) * 100).toFixed(2);
      } else if (coinT) {
        if (
          page["intentTemp"] === "卖出" ||
          page["intentTemp"].indexOf("平") !== -1
        ) {
          if (low - Number(_BOLL_15min[2]) * 1.0 <= 0) {
            // if (low) {    /* 测试买入 */
            exchange[element] = ["买入", low];
          }
        }
      }
    });

    exports.BOLL_15min = boll_15min;
    // exports.BOLL_3min = boll_3min;
    // exports.BOLL_15min = boll_15min;
    exports.change = exchange;
    // exports.secondSpeed = secondSpeed;
    // // 个人盈利VS指数
    // // 成本仓位
    // costPrice = 0.070944;
    // exports.rateKPrice = ((Datas["coinPrice"] / costPrice - 1) * 100).toFixed(3);
  } catch (error) {
    console.log("计算数据等待接入");
  }
}, 1000);

/*均线走势-旧交易策略 */
// 5、只要均线从微弱下行变为剧烈下行，马上抛出，等待均线平稳后入场
// setInterval(() => {
//   // 先获取所有变量，减少I/O消耗
//   let ins15 = increase["increase15"];
//   let ins60 = increase["increase60"];
//   let saveBuy = data["sell1"] > data["donePrice"] * 0.998;
//   let saveSell = data["sell1"] > data["donePrice"] * 1.005;
//   let _saveBuy = saveBuy;
//   exports.saveBuy = _saveBuy;

//   let exchange = "等待交易";
// //   // MA交易策略
// //   if (result60 === "平缓") {
// //     if (result15 === "缓慢上行") {
// //         if (ins60 >= 0 && ins15 < -0.3 && saveBuy) {
// //           exchange = "买入";
// //         } else if (ins60 > 0 && ins15 < 0.6 && saveSell) {
// //           exchange = "卖出";
// //         }
// //     } else {
// //         if (ins60 < -0.3 && saveBuy) {
// //             exchange = "买入";
// //         } else if (ins60 > 0.3 && saveSell) {
// //             exchange = "卖出"
// //         }
// //     }
// //   } else if (result60 === "微弱下行") {
// //     if (ins60 < -0.6 && saveBuy) {
// //       exchange = "买入";
// //     } else if (ins60 > -0.2 && saveSell) {
// //       exchange = "卖出";
// //     }
// //   } else if (result60 === "缓慢上行") {
// //     if (ins60 < 0.2 && saveBuy) {
// //       exchange = "买入";
// //     } else if (ins60 > 0.6 && saveSell) {
// //       exchange = "卖出";
// //     }
// //   } else if (result60 === "剧烈下行") {
// //     // 剧烈下行基本都卖出
// //     if (ins60 < -2.5 && saveBuy) {
// //       exchange = "买入";
// //     } else if (ins60 > -2) {
// //       exchange = "卖出";
// //     }
// //   } else if (result60 === "高速上行") {
// //     if (ins60 < 0.5 && saveBuy) {
// //       exchange = "买入";
// //     } else if (ins60 > 1 && saveSell) {
// //       exchange = "卖出";
// //     }
// //   }
//   exports.change = exchange;
//   const base = 27.79
//   try {
//       exports.rate = Number((data["assets"].replace("$","") / base - 1) * 100).toFixed(3);
//   } catch (error) {
//       console.log("等待数据接入。。。");
//   }
// }, 1000);

/*交易指标函数 */
// （MAn，长度length）如，MA60线，最近30组的MA60队列
function MAs(n, length, arr) {
  let queue = new Queue();
  let queueMAs = new Queue();
  for (let start = 0; start < length; start++) {
    for (let index = start; index < n + start; index++) {
      queue.enqueue(Number(arr[index][4]));
    }
    temp = (sum(queue.item) / n).toFixed(6);
    queueMAs.enqueue(temp);
    queue.clear();
  }
  return queueMAs;
}
// MAs队列更新
function MAsUpdate(_MAn, queueMAs) {
  queueMAs.unshift(_MAn);
  queueMAs.pop();
}
// MA单次计算
function MA(n, arr) {
  let queue = new Queue();
  for (let index = 0; index < n; index++) {
    queue.enqueue(Number(arr[index][4]));
  }
  return (sum(queue.item) / n).toFixed(6);
}
// MD标准差计算-已验证
function MD(_MAn, queueMAs, length = 20) {
  let avg = sum(queueMAs["item"], length) / length;
  let arr = [];
  for (let index = 0; index < length; index++) {
    const element = Number(queueMAs["item"][index]);
    const sd = Math.pow(element - avg, 2);
    arr.push(sd);
  }
  return Math.sqrt(sum(arr) / length);
}
// 计算BOLL带（默认周期20）,k为特性参数，一般设为2.经反复测算，k≈5，比OKEN的BOLL区间稍稍窄（安全起见），MB延时0.5~1分钟
// function BOLL(_MAn, queueMAs, k = 6.845) {
function BOLL(_MAn, queueMAs, k = 10) {
  const _MD_ = Number(MD(_MAn, queueMAs)); // 标准差
  let _MB = Number(queueMAs.item[1]); // 中轨为前一次MA值
  let _UP = Number(_MB + k * _MD_);
  let _DN = Number(_MB - k * _MD_);
  let UP = _UP > 1 ? _UP.toFixed(3) : _UP.toFixed(6);
  let MB = _MB > 1 ? _MB.toFixed(3) : _MB.toFixed(6);
  let DN = _DN > 1 ? _DN.toFixed(3) : _DN.toFixed(6);
  return [UP, MB, DN];
}
// 计算均线走势
// 例子
/**
if (calculate < -0.18 && calculate > -0.5) {
        result = "微弱下行";
      } else if (calculate <= -0.5) {
        result = "剧烈下行";
      } else if (calculate > 0.18 && calculate < 0.5) {
        result = "缓慢上行";
      } else if (calculate >= 0.5) {
        result = "高速上行";
      } else {
        result = "平缓";
      }
 */
/**
      // 计算均线走势
      result15 = MA_Direct(
        _MA15,
        queueMA15,
        5,
        -0.1,
        -0.3,
        -0.3,
        0.1,
        0.3,
        0.3
      );
      result60 = MA_Direct(
        _MA60,
        queueMA60,
        12,
        -0.18,
        -0.5,
        -0.5,
        0.18,
        0.5,
        0.5
      );
      exports.res15 = result15;
      exports.res60 = result60;
 */
function MA_Direct(
  _MAn, //即时MAn值
  queueMAn, //MAn队列
  range, //每次判断区间，不能超过MAn队列长度
  slow_down_a,
  slow_down_b,
  fast_down,
  slow_up_a,
  slow_up_b,
  fast_up
) {
  let calculate = Number((_MAn / queueMAn.item[range] - 1) * 100).toFixed(2);
  if (calculate < slow_down_a && calculate > slow_down_b) {
    result = "微弱下行";
  } else if (calculate <= fast_down) {
    result = "剧烈下行";
  } else if (calculate > slow_up_a && calculate < slow_up_b) {
    result = "缓慢上行";
  } else if (calculate >= fast_up) {
    result = "高速上行";
  } else {
    result = "平缓";
  }
  return result;
}

/*队列重构 */
class Queue {
  constructor() {
    this.item = [];
  }
  // 压入尾部
  enqueue(element) {
    this.item.push(element);
  }
  // 压入头部
  unshift(element) {
    this.item.unshift(element);
  }
  // 前端删除
  dequeue() {
    this.item.shift();
  }
  // 尾部删除
  pop() {
    this.item.pop();
  }
  // 查看（最新）最尾元素
  behind() {
    return this.item[this.item.length - 1];
  }
  // 队列是否为空
  isEmpty() {
    return this.item.length === 0;
  }
  // 清空
  clear() {
    this.item.length = 0;
  }
}
// 求和
function sum(arr, len = arr.length) {
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Number(arr[i]);
  }
  return sum;
}
