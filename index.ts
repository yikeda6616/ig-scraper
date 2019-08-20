import puppeteer from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';

const main = async () => {
  console.log('Launch');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(devices['iPhone X']);

  const url = 'https://instagram.com/';
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.screenshot({ path: 'screenshot.png' });

  await page.title();

  await browser.close();
  console.log('Close');
};

main();
