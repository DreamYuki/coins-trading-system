const puppeteer = require("puppeteer");
// const puppeteer = require("/usr/local/lib/node_modules/puppeteer");
// 总资产
const allAsset = ".assets-valuation-num";

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
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    defaultViewport: {
      width: 1600,
      height: 1024,
    },
    ignoreDefaultArgs: ["--enable-automation"],
    // executablePath: "/usr/bin/chromium-browser",
  });

  /*2、首次启动信息加载的页面 */
  //   资产管理页面[1]
  const page2 = await browser.newPage();
  await page2.goto("https://www.okexcn.com/balance/overview");
  page2.waitForSelector(allAsset);
  const asset = await page2.$eval(allAsset, (el) => el.innerHTML);
  console.log(asset);
})();