# Open Graph Image Generator

![](https://github.com/BoyWithSilverWings/generate-og-image/workflows/Run%20tests/badge.svg)

A GitHub Action that generates Open Graph images from your markdown files. It runs on PRs, reads frontmatter config, and creates images for your blog posts.

I built this because I was tired of either having no OG images or manually creating them for every post. This just automates it based on your existing markdown.

## Setup

Add to your workflow:

```yml
name: "Generate OG Images"
on: pull_request

jobs:
  generate_og_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: BoyWithSilverWings/generate-og-image@3.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_CONTEXT: ${{ toJson(github) }}
        with:
          path: src/images/post-images/
          ignorePatterns: "/README.md,/CHANGELOG.md"  # Optional: customize ignored files
```

Then add to your markdown frontmatter:

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

## Configuration

### Frontmatter Props

| Props      | Description                     | Required |      Default      |
| ---------- | ------------------------------- | :------: | :---------------: |
| title      | Title text                      |          |                   |
| subtitle   | Subtitle text                   |          |                   |
| imageUrl   | Image or emoji URL              |          |                   |
| background | Background color/gradient/image |          |                   |
| fontColor  | Text color                      |          |                   |
| fontSize   | Font size                       |          |       100%        |
| fileName   | Output filename                 |          | kebab-cased title |

Works with PRs and `.md`/`.mdx` files.

### Repository Props

Configure in your workflow file:

| Props        | Description               | Required |         Default         |
| ------------ | ------------------------- | :------: | :---------------------: |
| path         | Where to save images      |    ✅    |                         |
| commitMsg    | Commit message            |          |                         |
| background   | Default background        |          |                         |
| fontColor    | Default text color        |          |                         |
| fontSize     | Default font size         |          |                         |
| componentUrl | Custom web component      |          |                         |
| botComments  | Disable comments (`"no"`) |          |                         |
| ignorePatterns | Files to ignore (globs) |          | `/README.md` |

Frontmatter overrides repository settings.

## Examples

**Gradient background:**

```yaml
background: "linear-gradient(to right, #ec008c, #fc6767)"
```

**Image background:**

```yaml
background: "url(https://example.com/image.png)"
```

**Emoji instead of image:**

```yaml
imageUrl: "🚀"
```

**Disable bot comments:**

```yaml
botComments: "no"
```

## File Filtering

By default, the action ignores `/README.md` to prevent generating OG images for repository documentation. You can customize which files to ignore using glob patterns.

### Basic Usage

```yaml
- uses: BoyWithSilverWings/generate-og-image@3.0.0
  with:
    ignorePatterns: "/README.md,/CHANGELOG.md"
```

### Pattern Examples

| Pattern | Description | Example Matches |
|---------|-------------|-----------------|
| `/README.md` | Exact file at root | `/README.md` |
| `**/README.md` | README.md in any directory | `/docs/README.md`, `/src/README.md` |
| `**/*.config.md` | All .config.md files | `/webpack.config.md`, `/jest.config.md` |
| `docs/**` | All files in docs directory | `/docs/api.md`, `/docs/guides/setup.md` |
| `{README,CHANGELOG}.md` | Multiple specific files | `/README.md`, `/CHANGELOG.md` |

### Common Use Cases

**Ignore documentation files:**
```yaml
ignorePatterns: "/README.md,/CHANGELOG.md,/LICENSE.md"
```

**Ignore entire directories:**
```yaml
ignorePatterns: "docs/**,examples/**"
```

**Ignore AI assistant files:**
```yaml
ignorePatterns: "/CLAUDE.md,/GPT.md,**/*.prompt.md"
```

**Process all files (disable filtering):**
```yaml
ignorePatterns: ""
```

## Customization

The default web component is [here](https://github.com/BoyWithSilverWings/og-image-element). Replace it with your own:

```yaml
componentUrl: "https://your-custom-component.js"
```

## Contributing

See [docs](./docs/contributors.md)

## Credits

- [Vercel OG Image](https://github.com/zeit/og-image)
- [Vercel NCC](https://github.com/vercel/ncc)
- [GitHub Image Actions](https://github.com/calibreapp/image-actions)
