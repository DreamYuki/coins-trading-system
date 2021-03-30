module.exports = {
  headless: true,
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
  executablePath: "/usr/bin/chromium-browser",
};