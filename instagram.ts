import puppeteer from 'puppeteer';

const BASE_URL = 'https://instagram.com/';

const instagram = {
  browser: null as any,
  page: null as any,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false, // debug purpose
      slowMo: 50 // Make execution slow
    });

    instagram.page = await instagram.browser.newPage();

    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    await instagram.browser.close();
  }
};

export default instagram;
