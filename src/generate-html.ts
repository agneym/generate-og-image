import { IRepoProps } from "./types";
import { debug } from "@actions/core";

function generateHtml(prop: Partial<IRepoProps>) {
  debug(JSON.stringify(prop));
  return `
    <!doctype html>
    <html lang="en-GB">
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css?family=Aleo|Open+Sans&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          font-family: 'Open Sans', sans-serif;
        }
        og-image-element {
          --heading-font: 'Aleo', serif;
          --background: ${prop.backgroundColor};
          --font-color: ${prop.fontColor};
        }
      </style>
      <script type="module" rel="preload" src="${prop.componentUrl}"></script>
    </head>
    <body>
      <og-image-element subtitle=${prop.subtitle || ""}>
        ${
          prop.imageUrl
            ? `<img slot="image" src="${prop.imageUrl}" height="100%" />`
            : ``
        }
        <div slot="title">${prop.title}</div>
      </og-image-element>
    </body>
    </html>
  `;
}

export default generateHtml;
