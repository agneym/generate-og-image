import puppeteer from "puppeteer-core";

import { REPO_DIRECTORY } from "./constants";

async function generateImage() {
  console.log(REPO_DIRECTORY);
  const browser = await puppeteer.launch({ executablePath: 'google-chrome-unstable' }) 
  await browser.close();
}

export default generateImage;