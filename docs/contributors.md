# Contributors

## Getting started

1. Clone the repository
2. Install dependencies: `bun install`
3. Make your changes
4. Push the branch and create a PR

## Prerequisites

1. [Bun](https://bun.sh/) - JavaScript runtime and package manager
2. Node.js (for compatibility)

## Development Commands

### Install Dependencies
```bash
bun install
```

### Type Checking
```bash
bun --bun tsc --noEmit
```

### Building
```bash
# Build for development
bun build src/main.ts --outdir dist --target node

# Build for release (compiled binary)
bun build src/main.ts --compile --outfile dist/index.js
```

### Code Quality
```bash
# Format code with Biome
bun run format

# Check formatting and linting
biome check --write
```

### Testing
Tests are written with Bun's native test runner.

```bash
bun test
```

## Development Workflow

1. Make your changes
2. Run type checking: `bun --bun tsc --noEmit`
3. Format code: `bun run format`
4. Run tests: `bun test`
5. Build for testing: `bun run build`
6. Push the branch and create a PR

The output is the workflow named _Generate OG Images_ running in GitHub Actions on every PR.

## Code Standards

- Uses **Biome** for formatting and linting (replaces Prettier + ESLint)
- Pre-commit hooks run `biome check --write` via lefthook
- TypeScript for type safety

## Architecture Overview

This is a GitHub Action that generates Open Graph (OG) images from markdown files in pull requests using:

- **Bun** - Runtime and build tool
- **TypeScript** - Type-safe development
- **Puppeteer** - Headless Chrome for image generation
- **Biome** - Code formatting and linting
- **Docker** - Container runtime for GitHub Actions
