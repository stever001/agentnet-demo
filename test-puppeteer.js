const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: 'new',
    });
    console.log('✅ Puppeteer launched Chrome successfully!');
    await browser.close();
  } catch (error) {
    console.error('❌ Puppeteer failed to launch:', error);
  }
})();
