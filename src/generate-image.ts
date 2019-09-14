import puppeteer from "puppeteer-core";
import path from "path";

import { REPO_DIRECTORY } from "./constants";

async function generateImage(html: string = `<h1>Default content</h1>`) {
  console.log(REPO_DIRECTORY);
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' }) ;
  const page = await browser.newPage();
  await page.setContent(html);
  await page.screenshot({ path: path.join("./", "example.png") });
  await browser.close();
}

generateImage();

export default generateImage;