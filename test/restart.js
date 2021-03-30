// const { timeout } = require("async");
const child_process = require("child_process");

const child = () => {
    child_process.execSync("node main", {
      stdio: [0, 1, 2],
    });
}
function restart() {
    // 启动项目
    child();
    // 项目关闭后自动重启
    restart();
}
restart();
// console.log("111");
// const { spawn } = require("child_process");
// const ls = spawn('ls', ['-lh', '/usr']);
