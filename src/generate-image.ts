import puppeteer from "puppeteer-core";

import { REPO_DIRECTORY } from "./constants";

async function generateImage(html: string = `<h1>Default content</h1>`) {
  const browser = await puppeteer.launch({ executablePath: 'google-chrome-unstable' }) ;
  const page = await browser.newPage();
  await page.setContent(html);
  const image = await page.screenshot({ encoding: "base64" });
  await browser.close();
  return image;
}

export default generateImage;