 
FROM oven/bun:1-debian

# Install Google Chrome
RUN apt update && apt install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnss3-dev \
    libxss1 \
    libasound2 \
    --no-install-recommends \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-signing-key.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-key.gpg] https://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list \
    && apt update \
    && apt install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# When installing Puppeteer through npm, instruct it to not download Chromium.
# Puppeteer will need to be launched with:
#   browser.launch({ executablePath: 'google-chrome-unstable' })
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN mkdir -p /usr/local/src/generate-og-image
WORKDIR /usr/local/src/generate-og-image

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# copy in src
COPY tsconfig.json bunfig.toml /usr/local/src/generate-og-image/
COPY src/ /usr/local/src/generate-og-image/src/
COPY __tests__/ /usr/local/src/generate-og-image/__tests__/

RUN bun run build-release

RUN chmod +x /usr/local/src/generate-og-image/dist/index.js

ENTRYPOINT ["/usr/local/src/generate-og-image/dist/index.js"]