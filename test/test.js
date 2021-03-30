
// apiData
// 1秒/次---峰值：上传：1.2Mbps，下载：9.1Mbps；均值：上传：200Kbps，下载：700Kbps
// 2秒/次---峰值：上传：790Kbps，下载：7.1Mbps；均值：上传：100Kbps，下载：500Kbps
function test_internet() {
    const Datas = require("../src/resource/apiData");
    setInterval(() => {
        Datas["datas"]["coins"].forEach(element => {
            const temp1 = element + 60
            const temp2 = element + 180
            const temp3 = element + 900
            const temp4 = element + 3600
            console.log(Datas["datas"][temp1]);
            console.log(Datas["datas"][temp2]);
            console.log(Datas["datas"][temp3]);
            console.log(Datas["datas"][temp4]);
        });
    }, 2000);
}
// test_internet()



// let color = "\x1B[31m%s\x1B[0m";
// const arr = [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
// ];
// console.table(arr);
// var data = [
//   { name: "zhaoqain", age: 28 },
//   { name: "sunli", age: 25 },
//   { name: "zhuwu", age: 20 },
// ];
// console.time("交易完成，用时：");
// console.log("开始交易");
// for (let i = 0; i < 100; i++) {}
// console.timeEnd("交易完成，用时：");

// let kong = {}
// kong.static = null
// kong.static1 = 1
// kong.static2 = 2
// kong.static3 = 3
// kong.static5 = 5
// console.log(kong);
// for (const key in kong) {
//     console.log(kong[key]);
// }


// (async () => {
//   async function mouseDown(selector) {
//     const allselector = await page.waitForSelector(selector);
//     const allinfo = allselector.boundingBox();
//     await page.mouse.move((await allinfo).x + 2, (await allinfo).y);
//     await page.mouse.down();
//     await page.waitForTimeout(80 + Math.random() * 20);
//     await page.mouse.up();
//   }

//   const sleep = require("./src/sleep");
//   const puppeteer = require("puppeteer");
//   let tradings = function (a, b) {
//     let temp = `ul.order-book-list:nth-child(${a}) > div:nth-child(1) > div:nth-child(1) > li:nth-child(${b}) > span:nth-child(1) > em:nth-child(1)`;
//     // 动态标签，故难以捕捉
//     // let temp =
//     //   "ul.order-book-list:nth-child(1) > div:nth-child(1) > div:nth-child(1) > li:nth-child(1)";
//     //   "#app > div > div.trade-panel-box > div > div.layout-lg-right > div.layout-lg-right-top > div.layout-lg-right-top-left > div > div > div.okui-tabs-panel-list > div > div > div > div.order-book-body > div.book-body-wrap > ul.order-book-list.asks > div > div > li:nth-child(1)";

//     return temp;
//   };
//   const toSell = "div.okui-tabs-pane-xs:nth-child(2) > div:nth-child(1)";
//   const all = "div.okui-slider-mark-node:nth-child(5)";
//   const percent75 = "div.okui-slider-mark-node:nth-child(4)";
//   const trade = ".btn-sm > span:nth-child(1)";
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: {
//       width: 1600,
//       height: 1024,
//     },
//     userDataDir:
//       "C:/Users/Administrator.win10-2020HODKP/AppData/Local/Google/Chrome/User Data",
//     ignoreDefaultArgs: ["--enable-automation"],
//   });
//   const coin = "GRT";
//   tradeURL = `https://www.okexcn.com/trade-spot/${coin}-usdt`;
//   const page = await browser.newPage();
//   //   page.setDefaultNavigationTimeout(5000)
//   await page.goto(tradeURL);
//   sleep(5000);
//   // 所有标签找到后再快速执行，挂卖5档马上吃单买进
//   let sell5 = tradings("1", "5");
//   await mouseDown(toSell, page)
//   await mouseDown(toSell, page)
//   await mouseDown(sell5, page);
//   await mouseDown(sell5, page);
//   await mouseDown(all, page);
//   await mouseDown(all, page);
//   await mouseDown(trade, page);

//   // 法一：handle法
//   // handleClick(toSell);

//   //   handleClick(buy5);

//   //   法二：DOM操作法
//   //   await page.evaluate(() => {
//   //     // let buy5 = tradings("3", "5");
//   //     document.querySelector(
//   //       "ul.order-book-list:nth-child(3) > div:nth-child(1) > div:nth-child(1) > li:nth-child(5) > span:nth-child(1) > em:nth-child(1)"
//   //     );
//   //   });

//   // 法三：直接坐标法
//   //   坐标改的时候再用，省的增加运算时间
//   //   let sell5 = tradings("1", "5");
//   //   {
//   //   x: 350,
//   //   y: 278.20001220703125,
//   //   width: 36.712493896484375,
//   //   height: 13.600006103515625
//   // }

//   //   let buy5 = tradings("3", "5");
//   //   {
//   //   x: 350,
//   //   y: 490.20001220703125,
//   //   width: 36.712493896484375,
//   //   height: 13.600006103515625
//   // }

//   //   const allselector = await page.waitForSelector(selector);
//   //   const allinfo = allselector.boundingBox();
//   // //   console.log(await allinfo);
//   //   // { x: 307, y: 395, width: 8, height: 8 }
//   //   await page.mouse.move((await allinfo).x + 1, (await allinfo).y);
//   //   //   await page.mouse.move(307 + 1, 395);
//   //   await page.mouse.down();
//   //   await page.waitForTimeout(80 + Math.random() * 20);
//   //   await page.mouse.up();

//   //   page.waitForSelector(all);
//   //   await page.click(all);
//   //   sleep(200)
//   //   page.waitForSelector(all);
//   //   await page.click(all);

//   // await page.click(trade);
//   // count++;
//   // page.close();
//   // 原理：$$获取元素对象，拿到句柄直接click动态标签，十分稳定
//   async function handleClick(selector) {
//     page.waitForSelector(selector);
//     const handles = await page.$$(selector); //返回元素对象数组
//     const handle = handles[0]; //第一个就是元素句柄
//   }
// })();




// // 一行输出中一部分带颜色,不换行输出
// const static = false
// let color = "\x1B[37m%s\x1B[0m";
// process.stdout.write("不")
// process.stdout.write("换")
// process.stdout.write("行")
// // process.stdout.write(static ? (color, "输") : "");  //不可行，判断写到外面
// // static ? process.stdout.write(color, "输") : process.stdout.write("输");  //不可行，process.stdout.write不支持颜色输出
// color = static === true ? "\x1B[31m%s\x1B[0m" : "\x1B[32m%s\x1B[0m";
// console.log(color, "输出"); //可行

// const arr = [56,23,15,24,89,36,25,11,56,78,49,65];
// console.log(eval(arr.join("+")));
// const minY = Math.min.apply(null, arr);
// const minYindex = arr.indexOf(minY);
// console.log(minY);
// console.log(minYindex);

// const d = new Date();
// const year = d.getFullYear();
// const month = (d.getMonth() + 1).toString().padStart(2, "0");
// const day = d.getDate().toString().padStart(2, "0");
// const logName = year + "-" + month + "-" + day;
// console.log(logName);

// let content = "1234"
// let site = `\x1B[31m${content}\x1B[0m`;
// var site1 = { name: "Runoob"};
// site1[site] = "a2e2f"
// var site2 = { name: "Google", "\x1B[33m%s\x1B[0m": "\x1B[33m%s\x1B[0m" };
// var site3 = {
//   name: ("\x1B[33m%s\x1B[1m", "Taobao"),
//   "\x1B[33m%s\x1B[0m": "www.taobao.com",
// };

// console.table([site1, site2, site3],name);
// console.log("\x1B[33m%s\x1B[0m","awd");

// let color = "\x1B[33m%s\x1B[0m";
// var site1 = (color, { name: "Runoob", site: (color,111) })
// var site2 = { name: "Google", site: "www.google.com".red };
// var site3 = { name: "Taobao", site: "www.taobao.com" };
// console.table([site1, site2, site3]);
// console.log("%c%s", "color: red; background: blue; font-size: 20px;", "你好呀");
// console.log("\033[44;37m WATCH \033[40;34m 监听中...\033[0m");
// let colors = require("colors");
// console.log("rainbow_onstarted".blue);
// const { Table } = require("console-table-printer");
// const { clear } = require("console");
// const p = new Table();
// // 支持颜色混用
// p.addRow({ index: 1,text: "red wine", value: 10.212 }, { color: "yellow" });
// p.addRow(
//   { index: 2, text: "\x1B[41m\x1B[37m%s\x1B[7m\x1B[7m", value: 20.0 },
//   { color: "red" }
// );
// p.addRow({ index: 3, text: "gelb bananen", value: 100 }, { color: "yellow" });
// p.printTable();
// console.log(process.memoryUsage());
// setInterval(() => {
//     clear();
//     // p.printTable();
//     console.log("\033[44;37m WATCH \033[40;34m 监听中...\033[5m");
// }, 3000);

// let model = 1;
// if (model) {
//     console.log(model);
//   model = undefined;
// }
// if (model) {
//   console.log(model);
//   model = undefined;
// }
// console.log(new Date().getDate() >= 12);
// console.log(new Date().getHours());
// if (new Date().getDate() >= 12 && new Date().getHours >= 9) {
//     console.log(model);
// }

// let dayRate = -0.11;
// dayRate =
//   dayRate >= 0 ? `\x1B[41m${dayRate}%\x1B[0m` : `\x1B[42m${dayRate}%\x1B[0m`;
//   console.log(dayRate);

// let color = page["intentTemp"] === "买入" ? "red" : "green";
// const { clear } = require("console");
// const { resolve } = require("path");

// function logger() {
//     let i = 0;
//     const process1 = setInterval(() => {
//       if (i >= 3) {
//         console.log("clear");
//         clearInterval(process1);
//         logger();
//         // res("1")
//       }
//       // console.log(new Date());
//       let date = new Date().toString();
//       let info = JSON.stringify(process.memoryUsage());
//       console.log(date);
//       console.log(info);
//       date = null;
//       i++;
//     }, 0);
//     // return new Promise((res,err) => {
        
//     // })
// }

// (async () => {
//     const a = logger();
// })();



// module.exports = {
//     test: logger()
// }
const { clear, Console } = require("console");
class Interval {
    constructor() {
        this.i = 0
        this.b = null;
    }
    interval() {
        this.b = setInterval(() => {
          let process = require("process");
          let console = new Console({
            stdout: process.stdout,
            stderr: process.stderr,
          });
          console.log(new Date());
          let info = process.memoryUsage();
          console.log(info);
          if (this.i > 30) {
              let info = process.memoryUsage();
              console.log(info);
              process.exit();
            //   info = null;
            // clearInterval(this.b);
            // this.b = null;
            // this.i = 0;
          }
          console = null;
          process = null;
          this.i++;
        }, 1000);
    }
}
let interval = new Interval().interval();
// setInterval(() => {
// }, 10*1000);

