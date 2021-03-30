const getPixels = require("get-pixels");

function getLen() {
// exports.getLen = function () {
  return new Promise((resolve, reject) => {
    // getPixels("testPic.png", function (err, pixels) {
      getPixels("canvasBg.png", function (err, pixels) {
      if (!err) {
        //1、260宽按照固定x=37，按列遍历，得到最小R值<=20 --> 起始y值
        const shape = pixels["shape"];
        console.log(shape);
        // console.log(shape);
        const widthStart = parseInt(shape[0] / 6);
        console.log("起始搜索宽度", widthStart);
        let arr = [];
        let index = 0;
        for (let index = 0; index < shape[1]; index++) {
          const R_value = pixels.get(widthStart, index, 0);
          arr.push(R_value);
        }
        const minY = Math.min.apply(null, arr);
        const minYindex = arr.indexOf(minY);
        console.log("起始搜索高度：", minYindex);
        //1、miny值位置以下10，按行遍历，得到颜色最深值 --> 起始x值==滑块位置
        arr = []; //清空数组
        for (let index = 0; index < shape[0]; index++) {
          const R_value = pixels.get(index, minYindex + 10, 2);
          arr.push(R_value);
        }
        const minX = Math.min.apply(null, arr);
        const minXindex = arr.indexOf(minX);
        console.log("起始边界：", minXindex);
        //2、以首个minX为分界线，还是同一行，在后面区域遍历找新的minX2，这就是“坑”位置
        arr = []; //清空数组
        for (let index = minX + 20; index < shape[0]; index++) {
          const R_value = pixels.get(index, minYindex + 10, 2);
          arr.push(R_value);
        }
        const minX2 = Math.min.apply(null, arr);
        const minXindex2 = arr.indexOf(minX2);
        console.log("尾部边界：", minXindex2);
        console.log("滑动距离：", Math.abs(minXindex - minXindex2));
        resolve(Math.abs(minXindex - minXindex2));
      }
    });
  });
}


(async () => {
    const len =  await getLen();
    console.log(len);
})();
// const halfY = Number(baseY) + 10;
// const moveX = parseInt(halfX + Number(len / 2));
// const moveY = Number(baseY) - 20;
// await page.mouse.move(baseX, baseY);
// await page.mouse.down();
// await page.mouse.move(halfX, halfY);
// await page.mouse.move(moveX, moveY);
// await page.mouse.up();