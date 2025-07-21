const puppeteer = require('puppeteer');

async function fetchJsonLdFromUrl(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const jsonLdData = await page.$$eval('script[type="application/ld+json"]', scripts =>
    scripts.map(s => s.textContent.trim())
  );

  await browser.close();
  return jsonLdData;
}

module.exports = fetchJsonLdFromUrl;
