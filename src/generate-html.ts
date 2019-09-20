import { IRepoProps } from "./types";

function createVariables(name: string, value?: string) {
  if (value) {
    return `--${name}: ${value};`;
  }
  return "";
}

function generateHtml(prop: Partial<IRepoProps>) {
  return `
    <!doctype html>
    <html lang="en-GB">
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css?family=Nunito:600|Open+Sans&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          font-family: 'Open Sans', sans-serif;
        }
        og-image-element {
          --heading-font: 'Nunito', serif;
          ${createVariables("fontColor", prop.fontColor)}
          ${createVariables("background", prop.background)}
          ${createVariables("fontSize", prop.fontSize)}
        }
      </style>
      <script type="module" rel="preload" src="${prop.componentUrl}"></script>
    </head>
    <body>
      <og-image-element subtitle="${prop.subtitle || ""}">
        ${
          prop.imageUrl
            ? `<img slot="image" src="${prop.imageUrl}" height="100%" />`
            : ``
        }
        <div slot="title">${prop.title || ""}</div>
      </og-image-element>
    </body>
    </html>
  `;
}

export default generateHtml;
