async function generateHtml() {
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
    }
  </style>
</head>
<body>
  <script type="module">
    import 'og-image-element/og-image-element.js';
  </script>
  <og-image-element .subtitle="Thing">
    <div slot="title">Another Thing</div>
  </og-image-element>
</body>
</html>

  `;
}

export default generateHtml;
