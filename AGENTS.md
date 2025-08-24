# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub Action that generates Open Graph (OG) images from markdown files in pull requests. The action reads frontmatter configuration from `.md`/`.mdx` files and creates social media preview images using Puppeteer and a web component.

## Development Commands

### Build and Development
```bash
# Type checking
bun --bun tsc --noEmit

# Build for development
bun build src/main.ts --outdir dist --target node

# Build for release (compiled binary)
bun build src/main.ts --compile --outfile dist/index.js

# Run tests
bun test

# Format code
biome format --write
```

### Code Quality
- Uses Biome for formatting and linting with tab indentation and double quotes
- Pre-commit hooks run `biome check --write` via lefthook
- Type checking with TypeScript

## Architecture

### Core Flow (main.ts:17-56)
1. Validates GitHub environment (PR context only)
2. Gets repository configuration via `getRepoProps()`
3. Finds markdown files in PR with `findFile()`
4. For each file with OG config:
   - Generates HTML template with `generateHtml()`
   - Creates image using Puppeteer via `generateImage()`
   - Commits the image file with `commitFile()`
   - Posts preview comment (unless disabled)

### Key Modules
- **find-file.ts**: Discovers markdown files in PR, filters by patterns, extracts frontmatter
- **generate-image.ts**: Uses Puppeteer with Chrome to screenshot HTML into base64 image
- **file-filter.ts**: Applies glob patterns to ignore specific files (default: `/README.md`)
- **repo-props.ts**: Merges GitHub Action inputs with defaults
- **github-api.ts**: Octokit client for GitHub API operations

### Data Flow
- Input: Markdown files with `ogImage` frontmatter → File discovery & filtering → HTML generation → Image rendering → Git commit & comment

### Docker Environment
- Runs in Docker container with Chrome executable at `/usr/bin/google-chrome-stable`
- Uses `action.yml` to define GitHub Action interface

## File Structure
- `src/`: TypeScript source code
- `__tests__/`: Test files for core functionality  
- `dist/`: Built output
- `demo/`: Example generated images
- `action.yml`: GitHub Action configuration
- `Dockerfile`: Container setup for action runtime

## Configuration
- Repository settings via GitHub Action inputs (path, colors, fonts, etc.)
- Per-file settings via frontmatter `ogImage` object
- File filtering via `ignorePatterns` glob patterns