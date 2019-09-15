import puppeteer from "puppeteer-core";

async function generateImage(html: string) {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-unstable",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const image = await page.screenshot({ encoding: "base64" });
  await browser.close();
  return image;
}

export default generateImage;
