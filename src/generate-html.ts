import { IProps } from "./types";

function generateHtml(prop: Partial<IProps>) {
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
          --background-color: ${prop.backgroundColor};
          --font-color: ${prop.fontColor};
        }
      </style>
      <script type="module" rel="preload" src="https://unpkg.com/@agney/og-image-element@0.1.0"></script>
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
