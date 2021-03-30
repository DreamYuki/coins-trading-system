const puppeteer = require("puppeteer");
// const resemble = require("resemblejs");
// const Canvas = require("canvas");
// const cookies = require("./cookie")
const sleep = require("../src/sleep");
// const PictureRGBA = require("./PictureRGBA");
const readline = require('readline'); // 引入readline接口，读取输入行


(async () => {
  /* 浏览器启动配置 */
  const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/chromium-browser",
    // headless: true,
    headless: false,
    defaultViewport: {
      width: 1600,
      height: 1024,
    },
    // userDataDir:
    //   "C:/Users/Administrator.win10-2020HODKP/AppData/Local/Google/Chrome/User Data",
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
      console.log(error);
    }
  }
  const page = await browser.newPage();
  await page.goto("https://www.okexcn.com/");
  page.waitForSelector(login);
  await mouseDown(login, page);
  sleep(800);
  await mouseDown(account, page);
  sleep(1000);
  await page.keyboard.type("18776994680");
  await mouseDown(password, page);
  sleep(1000);
  await page.keyboard.type("ly117wHYM");
  sleep(1000);
  await mouseDown(loginBtn, page);
  sleep(1000);

  /*检测是否开启了滑动验证 */
  const pic = await page.waitForSelector(canvasBg);
  console.log("网页已开启滑动验证");
  sleep(2000)
  /*开始截图 */
  const canvas1 = await page.$(canvasBg);
  await canvas1.screenshot({ path: "canvasBg.png" });
  console.log("截图完成");
  sleep(2000)


//   const len =  await PictureRGBA["getLen"]();
//   console.log(len); //图片分析得到的距离有问题


  const selector = await page.waitForSelector(HUa);
  const allinfo = selector.boundingBox();
  const baseX = (await allinfo).x + 2;
  const baseY = (await allinfo).y;
  const rl = readline.createInterface({ // 创建输入输出接口
	input: process.stdin,
	output: process.stdout
});
console.log("等待输入距离");

  rl.on('line',async function(line) { // 监听控制台输入
  	const len = Number(line.trim()); // 获取控制台输入
  	// 防真人鼠标轨迹
    // 从一侧进入后点击
    let moveX = 0;
    let moveY = 0;
    for (let index = 0; index < 999; index++) {
      moveX = moveX + 3 * Math.random();
      moveY = moveY + 3 * Math.random();
      await page.mouse.move(
        moveX,
        moveY
      );
      sleep(10 * Math.random());
      if (baseX - moveX <= 3) {
        break;
      }
    }
  	await page.mouse.move(baseX, baseY);
    sleep(200);
    await page.mouse.down();
    let move = 0;
    for (let index = 0; index < 999; index++) {
        move = move + 3 * Math.random();
        await page.mouse.move(
          baseX + 2 + move,
          baseY + 15 * Math.random() - 25 * Math.random()
        );
        sleep(10 * Math.random());
        if (len - move <= 3) {
            break;
        }
    }
    sleep(500 * Math.random());
    await page.mouse.up();
  });

  

//   /*比较两张图片的不同 */
//   await new Promise((resolve) => {
//     resemble.outputSettings({
//       transparency: 0,
//     });
//     resemble("canvasBg.png")
//       .compareTo("canvasSlice.png")
//       .ignoreColors()
//       .onComplete((data) => {
//         fs.writeFileSync("diff.png", data.getBuffer());
//         resolve();
//       });
//   });
//   const picinfo = pic.boundingBox();

//   console.log("successfuly!");
//   await mouseDown(gooleCheck, page);

//   console.log("successfuly!");
//   page.close();
//   browser.close();
})();

const login =
  "#navContainer > ul > li.user-no-login > a.passport-btn.user-login-btn";
const account =
  "#loginBox > div > div > div:nth-child(1) > div > div.okui-input.input-md.login-name > div.okui-input-box > input";
const password =
  "#loginBox > div > div > div:nth-child(1) > div > div:nth-child(3) > div > input";
const loginBtn = "#loginBox > div > div > div.submit-btn-container > button";
const gooleCheck = "#loginBox > div > div > div > div > div.verify-input > div > div > div.left-input > div.code-section.active > input"

const canvasBg =
  "#body > div.geetest_panel.geetest_wind > div.geetest_panel_box.geetest_panelshowslide > div.geetest_panel_next > div > div.geetest_wrap > div.geetest_widget > div > a > div.geetest_canvas_img.geetest_absolute > div > canvas.geetest_canvas_bg.geetest_absolute";
const canvasSlice =
  "#body > div.geetest_panel.geetest_wind > div.geetest_panel_box.geetest_panelshowslide > div.geetest_panel_next > div > div.geetest_wrap > div.geetest_widget > div > a > div.geetest_canvas_img.geetest_absolute > div > canvas.geetest_canvas_slice.geetest_absolute";
const HUa =
  "#body > div.geetest_panel.geetest_wind > div.geetest_panel_box.geetest_panelshowslide > div.geetest_panel_next > div > div.geetest_wrap > div.geetest_slider.geetest_ready > div.geetest_slider_button";



