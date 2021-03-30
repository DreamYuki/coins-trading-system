const puppeteer = require("puppeteer");
const exchange = require("../computed/compute");
const fs = require('fs');
const { setTimeout } = require("timers");
const sleep = require('../sleep');
const selectors = require("./selectors");


(async () => {
  /*0、作用域内置函数*/
  async function mouseDown(selector, page) {
    try {
      const allselector = await page.waitForSelector(selector);
      const allinfo = allselector.boundingBox();
      await page.mouse.move((await allinfo).x + 2, (await allinfo).y);
      await page.mouse.down();
      await page.waitForTimeout(80 + Math.random() * 40);
      await page.mouse.up();
    } catch (error) {
      console.log("Again");
    }
  }

  /*1、浏览器启动配置 */
  const browser = await puppeteer.launch({
    // headless: true,
    headless: false,
    defaultViewport: {
      width: 1600,
      height: 1024,
    },
    userDataDir:
      "C:/Users/Administrator.win10-2020HODKP/AppData/Local/Google/Chrome/User Data",
    ignoreDefaultArgs: ["--enable-automation"],
  });

  /*2、启动信息加载的页面 */
  //   资产管理页面[1]
  const page2 = await browser.newPage();
  await page2.goto("https://www.okexcn.com/balance/overview");

  //   //   切换到美元计价
  //   await page2.click(toggleUnit);
  //   await page2.click(toggleUSD);

  // page4[4]，用于查询历史委托
  const page4 = await browser.newPage();
  await page4.goto("https://www.okexcn.com/trade-spot/doge-usdt");
  sleep(1000);
  await page4.click(historyBtn);
  await mouseDown(display, page4);

  /*3、初始化变量 */
  // 上次交易方向，用于监听改变
  let lastIntent = false;
  let timeTaker = 0; //计时重启资产总览
  let errorCount = 0; //错误次数
  let asset; //资产
  let finishSwitch = true; //挂单成功、结束的交易开关
  let exTime; //计时挂单
  let coolTime = 0; //交易周期间隔冷却计时
  let coolSwitch = true; //交易周期间隔冷开关

  /*4、页面操作&流信息 */
  setInterval(async () => {
    /**4-1  账户信息更新 */
    //  路径不是相对于当前js文件的路径，而是相对于执行node 命令的所在目录而言，这点要切记
    let count = Number(fs.readFileSync("./config/tradeCount.txt", "utf-8")); //交易触发次数

    //资产总览
    try {
      // 网络错误超过10次 || 运行时间过久可能导致信息无响应，重新打开网页，即使没有错误，长时间后网页也没有主动刷新
      if (errorCount < 10) {
        asset = await page2.$eval(allAsset, (el) => el.innerHTML);
        timeTaker++;
      } else {
        await page2.close();
        page2 = await browser.goto(overview);
        // await page2.goto(overview);
        // //   切换到美元计价
        // await page2.click(toggleUnit);
        // await page2.click(toggleUSD);
        errorCount = 0;
      }
    } catch (error) {
      errorCount++;
    }

    await page4.click(assetBtn);
    await page4.click(historyBtn);

    //当前订单状态变动
    let historyIndex = 1; // 交易发生变化时开始查询
    for (historyIndex; historyIndex < 10; historyIndex++) {
      //从上往下查询“完全成交”的订单，展示最新完全交易的订单
      let _intentResult = tryUntil(
        await page4.$eval(intentResult(historyIndex), (el) => el.innerHTML)
      );
      if (_intentResult === "完全成交") {
        break;
      } else {
        historyIndex++;
      }
    }
    let intentTemp = tryUntil(
      await page4.$eval(intent(historyIndex), (el) => el.innerHTML)
    );

    //累计触发计算 + 两个交易周期之间间隔10分钟;
    if (lastIntent) {
      if (lastIntent !== intentTemp) {
        count++;
        if (intentTemp === "卖出") coolSwitch = false;
      }
      if (!coolSwitch) {
        coolTime++;
        console.log("冷却：", coolTime);
        if (coolTime >= 600000/1800) coolSwitch = true;
    }
    }
    lastIntent = intentTemp;
    
    

    //交易方向
    let intentCoin = tryUntil(
      await page4.$eval(coinKind(historyIndex), (el) =>
        el.innerHTML.replace("/USDT", "").trim()
      )
    );

    //交易成本
    let cost = tryUntil(
      await page4.$eval(donePrice(historyIndex), (el) => el.innerHTML)
    );

    //交易时间
    let _tradeTime = tryUntil(
      await page4.$eval(tradeTime(historyIndex), (el) =>
        el.innerHTML
          .replace("</li><li>", "，")
          .replace("<li>", "")
          .replace("</li>", "")
      )
    );

    /**4-2 输出流、存储模块 */
    fs.writeFileSync("./config/tradeCount.txt", count.toString());
    exports.count = count;
    exports.intentTemp = intentTemp;
    exports.intentCoin = intentCoin;
    exports.cost = cost;
    exports.tradeTime = _tradeTime;
    exports.assets = asset;

    /**4-3 交易操作模块 */
    //节流阀——避免挂单后，重复交易操作
    if (finishSwitch && coolSwitch) {
      const signal = exchange["change"]; //接收交易信号（对象）
      // for...in 循环判断交易信号 -- 方便以后升级为权重交易决策，多个相同交易条件，最优选择
      for (const coin in signal) {
        let _exc = signal[coin][0];
        if (_exc === null) {
          // exports.static = null; //bug: null , 卖出 , null 会把信号遮住，而且流输出的也不是按顺序的，这就造成信号连续或间断，播报不准确
          // 大多数时候，绝大部分币种交易信号为null，最先判短，减少逻辑运算
          //买卖操作
        } else if (_exc !== null && _exc !== intentTemp) {
          async function mouseDown(selector, page) {
            try {
              const allselector = await page.waitForSelector(selector);
              const allinfo = allselector.boundingBox();
              await page.mouse.move((await allinfo).x + 2, (await allinfo).y);
              await page.mouse.down();
              await page.waitForTimeout(80 + Math.random() * 40);
              await page.mouse.up();
            } catch (error) {
              console.log("Again");
            }
          }
          if (_exc === "买入") {
            finishSwitch = false;
            exports.static = "买入";
            const page = await browser.newPage();
            await page.goto(tradeURL(coin));
            page.waitForSelector(trade_price);

            //   吃单买进
            //   let sell5 = tradings("1", "7");
            //   await mouseDown(sell5, page);
            //   await mouseDown(sell5, page);

            // 委托价格input框
            await mouseDown(trade_price, page);
            let Exprice = signal[coin][1].toString();
            sleep(1000);
            await page.keyboard.down("Shift");
            for (let i = 0; i < 10; i++) {
              await page.keyboard.press("ArrowRight");
            }
            await page.keyboard.up("Shift");
            await page.keyboard.press("Backspace");
            await page.keyboard.type(Exprice); // 立即输入
            //   await page.keyboard.type("10"); /* 测试 */

            await mouseDown(all, page);
            await mouseDown(all, page);
            await mouseDown(trade, page);
            await mouseDown(trade, page);

            setTimeout(() => {
              page.close();
            }, 2000);
            exports.static = null;
            exTime = 0;
          } else if (_exc === "卖出" && intentCoin === coin) {
            finishSwitch = false;
            exports.static = "卖出";
            // 交易操作-必须严格地同步、阻塞按顺序完成
            const page = await browser.newPage();
            await page.goto(tradeURL(coin));
            page.waitForSelector(trade_price);
            // 所有标签找到后再快速执行，按交易信号规定的价格委托出售，取消掉点击挂挡价格交易

            // 怀疑页面做了防脚本,page.click()往往无效，故直接获取XY坐标点击
            // 网站对mouse.down()的时间做了限制，太快的都不行
            // 所有点击操作重复2次，确保有效执行
            //   let buy5 = tradings("3", "7");
            await mouseDown(toSell, page);
            await mouseDown(toSell, page);
            sleep(300);
            //   await mouseDown(buy5, page);
            //   await mouseDown(buy5, page);

            // 委托价格input框
            await mouseDown(trade_price, page);
            let Exprice = signal[coin][1].toString();
            sleep(1000);
            await page.keyboard.down("Shift");
            for (let i = 0; i < 10; i++) {
              await page.keyboard.press("ArrowRight");
            }
            await page.keyboard.up("Shift");
            await page.keyboard.press("Backspace");
            await page.keyboard.type(Exprice); // 立即输入
            //   await page.keyboard.type("5000"); /* 测试 */

            await mouseDown(all, page);
            await mouseDown(all, page);
            await mouseDown(trade, page);
            await mouseDown(trade, page);

            setTimeout(() => {
              page.close();
            }, 2000);

            exports.static = null;
            exTime = 0;
          }
        }
      }
    } else {
      /*4-4 挂单检查&超时撤单模块*/
      await mouseDown(currentBtn, page4);
      sleep(800);
      try {
        const res = await page4.$eval(cancel, (el) => el.innerHTML);
        console.log("挂单中，等待成交。。。");
        // 如果长时间未成交，则执行撤单操作
        // 5min内，未成交即撤单  Extime= （3*60*1000）/ 1800 = 99
        if (exTime >= 99) {
          exTime = 0;
          await mouseDown(cancel, page4);
          await mouseDown(cancel, page4);
        }
        exTime++;
        console.log(exTime);
      } catch (error) {
        // 检测不到说明已经成交。
        finishSwitch = true;
      }
    }
  }, 1800);
})();


/* 外部调用函数 */
function tryUntil(value) {
    while (true) {
        try {
          value;
          return value;
        } catch (error) {}
    }
}


/** 各元素Selector */
// 买入转卖出
const toSell = "div.okui-tabs-pane-xs:nth-child(2) > div:nth-child(1)";
// 卖出转买入
const toBuy = "div.okui-tabs-pane-xs:nth-child(1) > div:nth-child(1)";
// 买卖挂单10档
let tradings = function (a, b) {
  let temp = `ul.order-book-list:nth-child(${a}) > div:nth-child(1) > div:nth-child(1) > li:nth-child(${b}) > span:nth-child(1) > em:nth-child(1)`;
  return temp;
};
// 买入/卖出btn
const trade = ".btn-sm > span:nth-child(1)";
// 委托价格
const trade_price = ".no-padding-right > input:nth-child(1)";
// 数量
const num =
  "div.place-order-input-box:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)";
// 全仓
const all = "div.okui-slider-mark-node:nth-child(5)";
// 75%
const percent75 = "div.okui-slider-mark-node:nth-child(4)";
// 金额
const money =
  "div.place-order-input-box:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)";
// 可用
const able =
  "div.avail-display-box:nth-child(4) > div:nth-child(1) > span:nth-child(2)";
// 交易界面-即将交易的金额
const willTrade =
  "div.place-order-input-box:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)";

// 资产btn
const assetBtn = "div.okui-tabs-pane-lg:nth-child(1) > div:nth-child(1)";
// USDT可用余额
const USDT = "li.coin-item:nth-child(2) > div:nth-child(4)";
// DOGE可用余额
const DOGE = "li.coin-item:nth-child(4) > div:nth-child(4)";
// 当前委托btn
const currentBtn = "div.okui-tabs-pane-lg:nth-child(2) > div:nth-child(1)";
// 当前委托-暂无记录
const tradeFinish = ".empty-box > span:nth-child(2)";
// 当前委托-委托方向
const tradeDirection = "span.up"; //"span.down";
// 当前委托-订单状态
const currentStatus =
  ".comb-table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(7) > span:nth-child(1)";
// 当前委托-最近一笔的撤单btn
const cancel = ".btn-xs";
// 历史委托btn- 订单起始序号均为1
const historyBtn = "div.okui-tabs-pane-lg:nth-child(3) > div:nth-child(1)";
// 隐藏“已撤销”
const display = ".checkbox-item > span:nth-child(1) > input:nth-child(1)";
// 业务线btn
const typeBtn =
  "#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-pane-list.okui-tabs-pane-list-lg.okui-tabs-pane-list-grey.okui-tabs-pane-list-underline.account-tab-header > div.okui-tabs-pane-list-slot > div > div > div > div:nth-child(1) > div > div.okui-select-value-box > div > div";
  // 业务线选择-全部
const allTypes = "div.okui-select-item:nth-child(1)";
// 业务线选择-币币
const coinByCoin = "div.okui-select-item:nth-child(2)";
// 业务线选择-永续
const perpetualContract = "div.okui-select-item:nth-child(5)";

// 历史委托-交易品种
const coinKind = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1)`;
}
// 历史委托-委托时间
const tradeTime = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(2) > ul:nth-child(1)`;
}
// 历史委托-交易方向
const intent = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(3) > span:nth-child(1)`;
}
// 订单状态 - 起始为1
const intentResult = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(9) > span:nth-child(1)`;
}
// 历史委托-成交均价
const donePrice = function (index) {
 return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(4) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > span:nth-child(1)`   
}
// 历史委托-已成交量
const doneNumber = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(5) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > span:nth-child(1)`
}
// 历史委托-委托总量
const planNumber = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(5) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2) > span:nth-child(1)`
}
// 手续费
const serviceCharges = function (index) {
    return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(6) > span:nth-child(1)`
}  

//  资产管理页面
// 总资产
const allAsset = ".assets-valuation-num";
// 切换单位btn
const toggleUnit = ".valuation";
// 本地货币（USD）
const toggleUSD = "div.item:nth-child(1) > div:nth-child(1)";
// 资产总览Btn
const assetOverviewBtn = "span.active";
// 金融业务Btn
const assetJinRongBtn = "li.top-menu-item:nth-child(4) > span:nth-child(1)";

// canvas
const canvas = "canvas.k-canvas:nth-child(2)";

/**相关网站 */
// 资产管理页面[1]
const overview = "https://www.okexcn.com/balance/overview";
// coins对usdt的交易页面
const tradeURL = function (coin) {
    return `https://www.okexcn.com/trade-spot/${coin}-usdt`;
}