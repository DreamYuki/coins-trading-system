const fs = require("fs");

/*
零点记录上一日收益和操作情况
*/
module.exports = function (ExTimes,coinRate, baseBlance) {
  const logName = new Date().toLocaleDateString().replace(/[/]/g, "-");
  const dayMoney = Number((baseBlance * (1+coinRate/100) - baseBlance).toFixed(2))
  const message = {
    date: logName, //注意：是，截止到该日的零点，一共24小时.如2021-02-28指2021-02-27一整天的数据
    ExTimes: ExTimes, //单日交易次数
    coinRate: coinRate, //单日收益
    baseBlance: baseBlance, //单日初始本金
    dayMoney: dayMoney
  };
  fs.appendFileSync(`./log/${logName}.log`, JSON.stringify(message) + "\n");
};
