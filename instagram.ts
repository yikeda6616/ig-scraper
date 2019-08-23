import puppeteer from "puppeteer";

const BASE_URL =
  "https://www.instagram.com/accounts/login/?source=auth_switcher";

const instagram = {
  browser: null as any,
  page: null as any,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false, // debug purpose
      slowMo: 50, // Make execution slow
    });

    instagram.page = await instagram.browser.newPage();
  },

  // TODO: LOGIN function
  login: async (username: string, password: string) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    // let loginButton = await instagram.page.$x(
    //   '//a[contains(text(), "Log in")]'
    // );

    // // Click on the login url button
    // await loginButton[0].click();

    // await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    // await instagram.page.waitFor(1000);

    // Type input fields - User ID & Password
    await instagram.page.type('input[name="username"]', username, {
      delay: 50,
    });
    await instagram.page.type('input[name="password"]', password, {
      delay: 50,
    });

    // Click on the login button
    const loginButton = await instagram.page.$('button[type="submit"]');

    await loginButton.click();

    await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });
  },
};

export default instagram;
