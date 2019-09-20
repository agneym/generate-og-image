import puppeteer from "puppeteer-core";
import { IViewport } from "./types";

async function generateImage(viewport: IViewport, html: string) {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-unstable",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  page.setViewport({
    width: +viewport.width,
    height: +viewport.height
  });
  await page.setContent(html);
  const image = await page.screenshot({ encoding: "base64" });
  await browser.close();
  return image;
}

export default generateImage;
