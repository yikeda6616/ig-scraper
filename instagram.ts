import puppeteer, { Browser, Page } from "puppeteer";

const BASE_URL =
  "https://www.instagram.com/accounts/login/?source=auth_switcher";

const TAG_URL = (tag: string) =>
  `https://www.instagram.com/explore/tags/${tag}/`;

export class Instagram {
  browser: Browser | null = null;
  page: Page | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
    });
    this.page = await this.browser.newPage();
  }

  async login(username: string, password: string) {
    await this.page?.goto(BASE_URL, { waitUntil: "networkidle2" });
    await this.page?.waitFor('input[name="username"]');
    await this.page?.waitFor(1000); // To make sure the form is loaded

    // Type input fields - User ID & Password
    await this.page?.type('input[name="username"]', username, {
      delay: 0,
    });
    await this.page?.type('input[name="password"]', password, {
      delay: 0,
    });

    // Click on the login button
    const loginButton = await this.page?.$('button[type="submit"]');
    await loginButton?.click();
    await this.page?.waitForNavigation({ waitUntil: "networkidle2" });
  }

  async likeTagsProcess(tags: string[] = []) {
    for (const tag of tags) {
      /* Go To the Tag Page */
      await this.page?.goto(TAG_URL(tag), { waitUntil: "networkidle2" });
      await this.page?.waitFor(1000);

      const posts = await this.page?.$$(
        'article > div:nth-child(3) img[decoding="auto"]'
      );

      for (const post of posts?.slice(0, 3) ?? []) {
        await post.click();

        await this.page?.waitFor('div[id="react-root"]');
        await this.page?.waitFor(1000);

        const likeSelector = 'button svg[aria-label="Like"]';
        const isLikable = await this.page?.$(likeSelector);

        if (isLikable) {
          await this.page?.click(likeSelector);
          console.log("--- A post has been Liked! ---");
        }

        const closeSelector = 'button svg[aria-label="Close"]';

        if (closeSelector) {
          const closeModalButton = await this.page?.$(closeSelector);

          if (!closeModalButton) {
            continue;
          }

          await closeModalButton.click();
        }

        await this.page?.waitFor(1000);
      }
    }
  }

  async close() {
    await this.browser?.close();
  }
}
