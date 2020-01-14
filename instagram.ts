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

  async saveImageProcess(tags: string[] = []) {
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

        /* 
        Multiple Postのロジック
        １枚目が画像か動画か判定
        画像なら保存 
        動画なら何もしない　span.videoSpritePlayButton
        次のスライドへ移動     coreSpriteRightChevron
        if 次のスライドがなければ次のポストへ
        2枚目が画像か動画か判定
        画像なら保存
        動画なら何もしない
        次のスライドへ移動
        if 次のスライドがなければ次のポストへ

        */
       const isImage = await this.page?.$x('//img[sizes="600px"]');
       const isVideo = awiat this.page?.$x('//span.videoSpritePlayButton');
       const hasNextSlide = this.page?.$('div.coreSpriteRightChevron');
       console.log(isImage, isVideo, hasNextSlide);

        // Skip this slide if it is a video
        if (!isImage) {
          continue;
        }

        await this.page?.click('span[aria-label="Like"]');
        console.log("--- An image has been saved! ---");

        const closeModalButton = await this.page?.$x(
          '//button[contains(text(), "Close")]'
        );

        if (!closeModalButton) {
          continue;
        }

        await closeModalButton[0].click();

        await this.page?.waitFor(1000);
      }
    }
  }

  async close() {
    await this.browser?.close();
  }
}
