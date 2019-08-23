import * as dotenv from "dotenv";

import ig from "./instagram";

const env = { ...(dotenv.config().parsed as any) };

(async () => {
  await ig.initialize();

  await ig.login(env.USERNAME, env.PASSWORD);

  debugger;
})();
