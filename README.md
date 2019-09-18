# Open Graph Image Generator

Generates open graph images for your blog with Github Actions.

In your action file:

```yml
name: "Generate OG Images"
on: pull_request

jobs:
  generate_og_job:
    runs-on: ubuntu-latest
    name: Generate OG Images
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Generate Image
        uses: BoyWithSilverWings/generate-og-image@1.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_CONTEXT: ${{ toJson(github) }}
        with:
          path: src/images/post-images/
```

For configuring the parameters, add following fields to the frontmatter:

```md
---
ogImage:
  title: "Things you don't know"
  subtitle: "There must be something"
  imageUrl: "https://example.com/image-url.jpg"
  background: "yellow"
  fontColor: "rgb(0, 0, 0)"
  fontSize: "100%"
---
```

## Frontmatter Props

| Props      |               Description               | Required |
| ---------- | :-------------------------------------: | -------: |
| title      |           Title of the image            |          |
| subtitle   |          Subtitle of the image          |          |
| imageUrl   |     The image thumbnail on the top      |          |
| background | Background color, gradient or image url |          |
| fontColor  |         any css supported color         |          |
| fontSize   |              the font size              |          |

Works only with Pull Requests and `md` and `mdx` files.

## Repository level Props

These are props that you can configure in the action file to customise the working.

| Props        |               Description                | Required |
| ------------ | :--------------------------------------: | -------: |
| path         |      Path to place the image URL in      |     true |
| commitMsg    |    Commit message when image is added    |          |
| background   | Background color, gradient or image url  |          |
| fontColor    |         any css supported color          |          |
| fontSize     |              the font size               |          |
| componentUrl | Web Component to be rendered for output. |          |

Frontmatter level props on a document always takes precedence over Repository level props.

### I need more customisation on the output.

The generator uses a web component to create the default output and provides a repository level prop to customise this web component.

The component currently being used is on [Github](https://github.com/BoyWithSilverWings/og-image-element) and published on [NPM](https://www.npmjs.com/package/@agney/og-image-element). The default URL is from [Unpkg](https://unpkg.com/) with [https://unpkg.com/@agney/og-image-element@0.2.0](https://unpkg.com/@agney/og-image-element@0.2.0).

You can substitute the same with `componentUrl` input in your workflow file. For more info on creating this web component, visit [source](https://github.com/BoyWithSilverWings/generate-og-image/blob/304fd9aa0b21b01b0fdc8a3d1a63a19ffdc1840d/demo/test-file.jpg)

## Thanks

1. [Zeit OG Image](https://github.com/zeit/og-image)

   Serverless based open graph image generator from zeit

2. [Zeit NCC](Compiler)

3. [Github Image Actions](https://github.com/calibreapp/image-actions)

   For some utils to copy from.
