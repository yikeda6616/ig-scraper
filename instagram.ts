import puppeteer from "puppeteer";

const BASE_URL =
  "https://www.instagram.com/accounts/login/?source=auth_switcher";

const TAG_URL = (tag: string) =>
  `https://www.instagram.com/explore/tags/${tag}/`;

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

  login: async (username: string, password: string) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

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

  likeTagsProcess: async (tags: string[] = []) => {
    for (const tag of tags) {
      /* Go To the Tag Page */
      await instagram.page.goto(TAG_URL(tag), { waitUntil: "networkidle2" });
      await instagram.page.waitFor(1000);

      let posts = await instagram.page.$$(
        'article > div:nth-child(3) img[decoding="auto"]'
      );

      for (let i = 0; i < 3; i++) {
        let post = posts[i];

        await post.click();

        await instagram.page.waitFor(
          'span[id="react-root"][aria-hidden="true"]'
        );
        await instagram.page.waitFor(1000);

        let isLikable = await post.$('span[aria-label="Like"]');

        if (isLikable) {
          await post.click('span[aria-label="Like"]');
        }

        await instagram.page.click('//button[contains(text(), "Close")]');
      }
    }
  },
};

export default instagram;
