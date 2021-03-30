const page = require("./resource/pageControl");
const compute = require("./computed/compute");
const Datas = require("./resource/apiData");
const logRecord = require("./logRecord");
const cp = require("child_process");
const { clear } = require("console");
const fs = require("fs");

module.exports = function () {
  /*1、执行后初始化变量 */
  let startDate = new Date(); //本次执行起点时间
  let hasBeenRun = fs.readFileSync("./config/hasBeenRun.txt", "utf-8"); // 记录累计运行时间
  let logTaker = fs.readFileSync("./config/dateTaker.txt", "utf-8");  //记录LOG
  let allCount = fs.readFileSync("./config/tradeCount.txt", "utf-8"); // 初始化为上次累计触发次数
  let baseBlance = fs.readFileSync("./config/baseBlance.txt", "utf-8"); // 初始化为上一日剩余本金，包括新划转的资金
  
  
  setInterval(() => {
    // clear();
    try {
      /*2、币对信息展示 */
      Datas["datas"]["coins"].forEach((element) => {
        const temp60 = element + 60;
        // const temp180 = element + 180;
        const temp900 = element + 900;
        const coinprice = Number(Datas["datas"][temp60][0][4]);

        // const LB_Rate1 = (
        //   (coinprice / Number(compute["BOLL_1min"][temp60][2]) - 1) *
        //   100
        // ).toFixed(2);
        // const UB_Rate1 = (
        //   (coinprice / Number(compute["BOLL_1min"][temp60][0]) - 1) *
        //   100
        // ).toFixed(2);

        // const LB_Rate3 = (
        //   (coinprice / Number(compute["BOLL_3min"][temp180][2]) - 1) *
        //   100
        // ).toFixed(2);
        // const UB_Rate3 = (
        //   (coinprice / Number(compute["BOLL_3min"][temp180][0]) - 1) *
        //   100
        // ).toFixed(2);

        const LB_Rate15 = (
          (coinprice / Number(compute["BOLL_15min"][temp900][2]) - 1) *
          100
        ).toFixed(2);
        const UB_Rate15 = (
          (coinprice / Number(compute["BOLL_15min"][temp900][0]) - 1) *
          100
        ).toFixed(2);

        // BOLL带宽幅
        // const BOLL_DIFF_1min = (Number(LB_Rate1) - Number(UB_Rate1)).toFixed(2);
        // const BOLL_DIFF_3min = (Number(LB_Rate3) - Number(UB_Rate3)).toFixed(2);
        const BOLL_DIFF_15min = (Number(LB_Rate15) - Number(UB_Rate15)).toFixed(2);

        //   交易色彩判断
        let color = "\x1B[37m%s\x1B[0m";
        if (element === page["intentCoin"]) {
          color =
            page["intentTemp"] === "买入"
              ? "\x1B[31m%s\x1B[0m" // 31红色，32绿色，37白色，30黑色
              : "\x1B[32m%s\x1B[0m";
        }

        console.log(
          color,
          element +
            " " +
            " 现价：" +
            coinprice +
            // //   BOLL数据展示
            //   "    1分钟： LB：" +
            //   compute["BOLL_1min"][temp60][2] +
            //   "    BOLL：" +
            //   compute["BOLL_1min"][temp60][1] +
            //   "    UB：" +
            //   compute["BOLL_1min"][temp60][0] +
            // "    1min：" +
            // "    LB%：" +
            // LB_Rate1 +
            // "%" +
            // "    UB%：" +
            // UB_Rate1 +
            // "%" +
            // "    宽幅：" +
            // BOLL_DIFF_1min

          // // //   BOLL数据展示
          // //   "    3分钟： LB：" +
          // //   compute["BOLL_3min"][temp180][2] +
          // //   "    BOLL：" +
          // //   compute["BOLL_3min"][temp180][1] +
          // //   "    UB：" +
          // //   compute["BOLL_3min"][temp180][0] +
          // "    3min：" +
          // "    LB%：" +
          // LB_Rate3 +
          // "%" +
          // "    UB%：" +
          // UB_Rate3 +
          // "%" +
          // "    宽幅：" +
          // BOLL_DIFF_3min +
            "        15分钟： LB：" +
            compute["BOLL_15min"][temp900][2] +
            "    BOLL：" +
            compute["BOLL_15min"][temp900][1] +
            "    UB：" +
            compute["BOLL_15min"][temp900][0] +
          "    15min：" +
          "    LB%：" +
          LB_Rate15 +
          "%" +
          "    UB%：" +
          UB_Rate15 +
          "%" +
          "    宽幅：" +
          BOLL_DIFF_15min
        //   "    涨速：" +
        //   compute["secondSpeed"][element] +
        //   " ‰ /s"
        );
      });
      console.log("");
      //   console.log("总资产：" + asset + "USD");
      const asset = page["assets"].replace(/[^\d.]/g, "");
      const base = Number(baseBlance);
      const assetRate = ((Number(asset) / base - 1) * 100).toFixed(2); //单日收益

      // /*高亏损风险警报*/
      // if (Number(assetRate) < -5) {
      //     cp.spawn("F:/VLC/vlc.exe", [
      //       "--play-and-exit",
      //       "./config/music/warning.mp3",
      //     ]);
      //     console.log("\x1B[31m%s\x1B[0m","高亏损警报！！！");
      // }

      /*3、总资产及当日盈亏 */
      let assetColor = "\x1B[37m%s\x1B[0m";
      assetColor =
        Number(asset) - base >= 0
          ? "\x1B[31m%s\x1B[0m" // 31红色，32绿色，37白色，30黑色
          : "\x1B[32m%s\x1B[0m";
      process.stdout.write("总资产：" + asset + "CNY ,");
      console.log(assetColor, assetRate + "%");

      /*4、最新交易状态展示 */
      process.stdout.write(
        "当前状态：" +
          "已" +
          page["intentTemp"] +
          page["intentCoin"] +
          " 成交价：" +
          page["cost"] +
          " 时间：" +
          page["tradeTime"] +
          " ,"
      );
      let rateColor =
        Number(compute["coinRate"]) > 0
          ? "\x1B[31m%s\x1B[0m"
          : "\x1B[32m%s\x1B[0m";

      /*5、交易信号 */
      // 看买入/卖出决定是否显示
      console.log(
        rateColor,
        page["intentTemp"] === "买入" ? compute["coinRate"] + "%" : ""
      );
      console.log("交易信号：" + page["static"]);

      // 交易产生时，播放提示铃声
      if (page["static"] !== null && page["static"] !== undefined) {
        const sound =
          page["static"] === "买入"
            ? cp.spawn("F:/VLC/vlc.exe", [
                "--play-and-exit",
                "./config/music/MSN.mp3",
              ])
            : cp.spawn("F:/VLC/vlc.exe", [
                "--play-and-exit",
                "./config/music/tencentgame.mp3",
              ]);
      }

      /*6、累计运行 和 累计触发 */
      // console.log(new Date().toLocaleString('zh-CN'));
      let count =
        parseInt((new Date() - startDate) / 1000) + Number(hasBeenRun);
      console.log(
        // "累计运行：" + count + "秒" + "\n" + "累计触发：" + page["count"] + "次"
        "累计运行：" +
          Math.floor(count / 86400) +
          "天" +
          Math.floor((count % 86400) / 3600) +
          "时" +
          Math.floor((count % 3600) / 60) +
          "分" +
          Math.floor(count % 60) +
          "秒"
      );
      console.log("累计触发：" + page["count"] + "次");

      /*7、零点后记录LOG日志 */
      if (Number(logTaker) !== new Date().getDate()) {
        logRecord(
          (Extimes = Number(page["count"]) - Number(allCount)),
          Number(assetRate),
          Number(baseBlance)
        );
        // 更新日期天数
        logTaker = new Date().getDate().toString();
        baseBlance = asset; //更新剩余本金
        fs.writeFileSync("./config/dateTaker.txt", logTaker);
        fs.writeFileSync("./config/baseBlance.txt", baseBlance);
      }

      /*8、存储static信息 */
      fs.writeFileSync("./config/hasBeenRun.txt", count.toString());

    } catch (error) {
      //   (启动前注意关闭Chrome，以免应用占用)
      console.log("等待数据输出。。。");
      console.log(error);
    }
  }, 2000);
};

// try {
//   main()
// } catch (error) {
//   console.log("网络中断，正在重启！");
//   main()
// }
