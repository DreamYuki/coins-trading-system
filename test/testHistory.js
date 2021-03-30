const puppeteer = require("puppeteer");
const selectors = require("../src/resource/selectors");
// const puppeteer = require("/usr/local/lib/node_modules/puppeteer");
// 总资产
const allAsset = ".assets-valuation-num";

// 上次交易方向，用于监听改变
  let lastIntent = false,
    // 计时重启资产总览
    timeTaker = 0,
    // 错误次数
    errorCount = 0,
    // 资产
    asset,
    // 计时挂单
    exTime,
    // 交易周期间隔冷却计时
    coolTime = 0,
    // 冷却阀
    coolSwitch = true,
    // 有效阀（只一次有效交易操作）
    oneExchange = true,
    // 历史委托更新阀
    isUpdate = true,
    // 委托方向
    intentTemp,
    // 委托币种
    intentCoin,
    // 成交价格
    cost = 0,
    // 交易数量
    num = [],
    // 成交[[价格，数量],[价格，数量]...]
    costArr = [],
    // 委托时间
    tradeTime,
    // 获取最新一条有效完成的委托
    h_index;
(async () => {
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
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=site-per-process",
    ],
    defaultViewport: {
      width: 1600,
      height: 1024,
    },
    ignoreDefaultArgs: ["--enable-automation"],
    // executablePath: "/usr/bin/chromium-browser",
    userDataDir:
      "C:/Users/Administrator.win10-2020HODKP/AppData/Local/Google/Chrome/User Data",
  });

  /*2、首次启动信息加载的页面 */
  //   资产管理页面[1]
  //   const page2 = (await browser.pages())[0];
  const page2 = await browser.newPage();
  await page2.goto("https://www.okexcn.com/trade-spot/doge-usdt", {
    waitUntil: "networkidle2",
  });
  // 查询资产总览页面
  const page4 = await browser.newPage();
  await page4.goto("https://www.okexcn.com/balance/overview", {
    waitUntil: "networkidle2",
  });
  /** 获取并读取selector */
  const selectorInfo = async (selector) => {
    await page2.waitForSelector(selector);
    return await page2.$$eval(selector, (els) =>
      els.map((el) => el.textContent)
    );
  };
  await mouseDown(selectors.historyBtn, page2);
  // 对于动态生成的标签，先点击一下，再获取即可
  await mouseDown(
    "#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-panel-list > div > div > div.order-table-box > table > tbody > tr:nth-child(3) > td:nth-child(3)",
    page2
  );

  console.log("点击完成");
  const tbody = await selectorInfo(
      selectors.tbody
    // "#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-panel-list > div > div > div.order-table-box > table > tbody"
  );
  //   console.log(tbody);
  let arr = tbody[0].trim().split(" ");
  //   console.log(arr);
  let arr3 = [];
  if (arr.length === 120) {
    for (let index = 0; index < 120; ) {
      if (arr[index + 5].indexOf("完全成交") === -1) continue;
      let str = arr[index];
      let str2 = arr[index + 2];
      index += 6;
      let coin = str.split("/USDT")[0];
      let date =
        str.split("/USDT")[1].slice(0, 10) +
        "，" +
        str.split("/USDT")[1].slice(10, 18);
      let intent = str.split("/USDT")[1].slice(18, 20);
      let cost = Number(str.split("/USDT")[1].slice(20).replace(",", ""));
      let num = Number(str2.replace(/USDT/, ""));
      let arr2 = [coin, date, intent, cost, num];
      arr3.push(arr2);
    }
  }
  console.log(arr3);
  function properties(arr) {
    // 返回值 [[最近一笔数组]，持仓成本]
    if (arr[0][2] === "卖出") return [arr[0].slice(0, 4), arr[0][3]];

    for (let x = 1; x < arr3.length; x++) {
      if (arr[x][2] === "卖出") {
        let cost = 0,
          num = 0;
        for (let y = x - 1; y >= 0; y--) {
          // 单次花费
          cost += arr[y][3] * arr[y][4];
          // 总数量
          num += arr[y][4];
        }
        // 保留位数和原币种提供的相同
        let fixindex = arr[x][3].toString().split(".")[1].length;
        return [
          arr[0].slice(0, 4),
          Number(Number(cost / num).toFixed(fixindex)),
        ];
      }
    }
  }
  console.log(properties(arr3));
  await page2.goto("https://www.okexcn.com/trade-spot/doge-usdt", {
    waitUntil: "networkidle2",
  });
})();

/* 获取标签内容，直至成功 */
function tryUntil(value) {
    let errorCount = 0;
    while (true) {
        try {
          value;
          return value;
        } catch (error) {
            console.log("第"+ errorCount + "次尝试");
        }
    }
}

// 资产btn
const assetBtn = "div.okui-tabs-pane-lg:nth-child(1) > div:nth-child(1)";
// 历史委托btn- 订单起始序号均为1
const historyBtn = "div.okui-tabs-pane-lg:nth-child(3) > div:nth-child(1)";
// 订单状态 - 起始为1
const intentResult = function (index) {
    // return `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(9) > span:nth-child(1)`;
    return "#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-panel-list > div > div > div.order-table-box > table > tbody > tr:nth-child(1) > td:nth-child(9) > span > span";
}

