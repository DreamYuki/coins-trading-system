let str = "XEM/USDT2021-03-1203:15:56买入0.59";
let coin = str.split("/USDT")[0];
let date = str.split("/USDT")[1].slice(0,18)
let intent = str.split("/USDT")[1].slice(18,20)
let cost = str.split("/USDT")[1].slice(20)

let str2 = "USDT403.8";
let num = str2.replace(/USDT/, "");
let arr = [coin, date, intent, cost, num];
console.log(arr.slice(0,4));
let str3 = "XEM--完全成交查看详情";
console.log(str3.indexOf("完全成交"));
let arr4 = ["XEM", "2021-03-12，03:15:56", "买入", 0.5923, 51.545];
let fixindex = arr4[3].toString().split(".")[1].length;
console.log(fixindex);