const puppeteer = require("puppeteer");
const sleep = require("../src/sleep");

(async () => {
  /* 浏览器启动配置 */
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1600,
      height: 1024,
    },
    ignoreDefaultArgs: ["--enable-automation"],
  });
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
  const page = await browser.newPage();
  await page.goto("https://www.baidu.com/");
  page.waitForSelector(login);
  await mouseDown(login, page);
  sleep(800);
  console.log("successfuly!");
  await page.reload();
//   browser.close();
})();

const login = "#u1 > a";
