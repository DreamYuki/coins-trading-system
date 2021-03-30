/* 各元素Selector */
/* 交易页面 */
module.exports = {
  // 买入转卖出
  toSell: "div.okui-tabs-pane-xs:nth-child(2) > div:nth-child(1)",
  // 卖出转买入
  toBuy: "div.okui-tabs-pane-xs:nth-child(1) > div:nth-child(1)",
  // 买卖挂单10档
  tradings: (a, b) =>
    `ul.order-book-list:nth-child(${a}) > div:nth-child(1) > div:nth-child(1) > li:nth-child(${b}) > span:nth-child(1) > em:nth-child(1)`,
  // 买入/卖出btn
  trade: ".btn-sm > span:nth-child(1)",
  // 委托价格
  trade_price: ".no-padding-right > input:nth-child(1)",
  // 数量
  num:
    "div.place-order-input-box:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)",
  // 全仓
  all: "div.okui-slider-mark-node:nth-child(5)",
  // 75%
  percent75: "div.okui-slider-mark-node:nth-child(4)",
  // 金额
  money:
    "div.place-order-input-box:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)",
  // 可用
  able:
    "div.avail-display-box:nth-child(4) > div:nth-child(1) > span:nth-child(2)",
  // 即将交易的金额
  willTrade:
    "div.place-order-input-box:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)",

  // 资产btn
  assetBtn: "div.okui-tabs-pane-lg:nth-child(1) > div:nth-child(1)",
  // USDT可用余额
  USDT: "li.coin-item:nth-child(2) > div:nth-child(4)",
  // DOGE可用余额
  DOGE: "li.coin-item:nth-child(4) > div:nth-child(4)",
  // 当前委托btn
  currentBtn: "div.okui-tabs-pane-lg:nth-child(2) > div:nth-child(1)",
  // 当前委托-暂无记录
  tradeFinish: ".empty-box > span:nth-child(2)",
  // 当前委托-委托币种
  currentCoin: "",
  // 当前委托-委托方向
  tradeDirection: "span.up", //"span.down",
  // 当前委托-订单状态
  currentStatus:
    ".comb-table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(7) > span:nth-child(1)",
  // 当前委托-最近一笔的撤单btn
  cancel: ".btn-xs",
  // tbodu
  tbody:
    "#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-panel-list > div > div > div.order-table-box > table > tbody",
  // 历史委托btn- 订单起始序号均为1
  historyBtn: "div.okui-tabs-pane-lg:nth-child(3) > div:nth-child(1)",
  // 隐藏“已撤销”
  display: ".checkbox-item > span:nth-child(1) > input:nth-child(1)",
  // 业务线btn
  typeBtn:
    "#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-pane-list.okui-tabs-pane-list-lg.okui-tabs-pane-list-grey.okui-tabs-pane-list-underline.account-tab-header > div.okui-tabs-pane-list-slot > div > div > div > div:nth-child(1) > div > div.okui-select-value-box > div > div",
  // 业务线选择-全部
  allTypes: "div.okui-select-item:nth-child(1)",
  // 业务线选择-币币
  coinByCoin: "div.okui-select-item:nth-child(2)",
  // 业务线选择-永续
  perpetualContract: "div.okui-select-item:nth-child(5)",
  // 历史委托-交易品种
  coinKind: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(1) > span:nth-child(1) > div:nth-child(1) > div:nth-child(1)`,
  // 历史委托-委托时间
  tradeTime: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(2) > span:nth-child(1) > ul:nth-child(1)`,
  // 历史委托-交易方向
  intent: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(3) > span:nth-child(1) > span:nth-child(1)`,
  // 订单状态 - 起始为1
  intentResult: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(9) > span:nth-child(1) > span`,
  // 历史委托-成交均价
  donePrice: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(4) > span:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > span:nth-child(1)`,
  // 历史委托-已成交量
  doneNumber: (index) =>
    //".comb-table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > span:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > span:nth-child(1)"
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(5) > span:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > span:nth-child(1)`,
  // 历史委托-委托总量
  planNumber: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(5) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2) > span:nth-child(1)`,
  // 手续费
  serviceCharges: (index) =>
    `.comb-table > tbody:nth-child(2) > tr:nth-child(${index}) > td:nth-child(6) > span:nth-child(1)`,

  // 资产管理页面
  // 总资产
  allAsset: ".assets-valuation-num",
  // 切换单位btn
  toggleUnit: ".valuation",
  // 本地货币（USD）
  toggleUSD: "div.item:nth-child(1) > div:nth-child(1)",
  // 资产总览Btn
  assetOverviewBtn: "span.active",
  // 金融业务Btn
  assetJinRongBtn: "li.top-menu-item:nth-child(4) > span:nth-child(1)",
};

