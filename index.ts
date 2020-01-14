import * as dotenv from "dotenv";
import { Instagram } from "./instagram";

const env: dotenv.DotenvParseOutput = dotenv.config().parsed ?? {};

(async () => {
  const ig = new Instagram();

  await ig.initialize();

  await ig.login(env.USERNAME, env.PASSWORD);

  await ig.saveImageProcess(["deathstranding"]);

  await ig.close();
})();
