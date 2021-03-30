# Node.js基于puppeteer的OKEX数字货币自动量化交易系统



## 简介

支持OKEx网所有币种的基础交易、杠杆交易和永续合约交易；

可实时查询币种现价、买卖10档价交易、总资产、交易记录等；

交易完成铃声提醒；

提供交易指标包括成交量、MA、BOLL带、涨速计算；

支持自定义交易策略。

执行示例：

![image-20210222184435472](C:\Users\Administrator.win10-2020HODKP\AppData\Roaming\Typora\typora-user-images\image-20210222184435472.png)



## 捐赠赞助

### 你们的支持将给予我更多动力去更新和维护本项目，祝各位老板财运滚滚！

BTC		18STRgGA7TAfxYWyKcG3r1oG7Ek9oXLbw4

ETH		0x26f97962d3f0577f3a9f53f409be8c23ef5b86a1



<img src="C:\Users\Administrator.win10-2020HODKP\Desktop\21416111191512.png" style="zoom:25%;" /><img src="C:\Users\Administrator.win10-2020HODKP\Desktop\1613996549510.jpg" style="zoom:33%;" /><img src="C:\Users\Administrator.win10-2020HODKP\Desktop\mm_facetoface_collect_qrcode_1613996567000.png" style="zoom:25%;" />



## 使用

1. 环境配置node.js v14.3.0+
2. 下载Chromium，添加到环境变量。
3. 



## 配置参考

### 测试值

无头模式下：

1. 网路吞吐量

   // 1秒/次---峰值：上传：1.2Mbps，下载：13.4Mbps；均值：上传：200Kbps，下载：700Kbps

   // 2秒/次---峰值：上传：790Kbps，下载：9.9Mbps；均值：上传：100Kbps，下载：500Kbps

2. 内存占用：约4.5GB

3. CPU速度：约3.17GHz

4. 磁盘I/O：均值：0.1Mb/秒，峰值：1.2Mb/秒

   （建议：合理控制自选币种数量、交易策略复杂度和数据请求频率，前二者会增加计算机运算负荷，后者会增加网络需求）

## 交易策略

### 指标说明

MA走势分析

BOLL带

成交量

### 交易模式

保本交易

止盈

止损

