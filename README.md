# Open Graph Generator

Generates open graph images for your blog with Github Actions.

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
title: "Things you don't know about something 2019"
ogImage:
  title: "Things you don't know"
  subtitle: "There must be something"
  imageUrl: "https://example.com/image-url.jpg"
---
```

Works only with Pull Requests and `md` and `mdx` files.
