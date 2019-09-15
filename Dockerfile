 
FROM node:12.10

RUN  apt-get update \
     # See https://crbug.com/795759
     && apt-get install -yq libgconf-2-4 gconf-service  libasound2  libatk1.0-0  libc6  libcairo2  libcups2  libdbus-1-3  libexpat1  libfontconfig1  libgcc1  libgconf-2-4  libgdk-pixbuf2.0-0  libglib2.0-0  libgtk-3-0  libnspr4  libpango-1.0-0  libpangocairo-1.0-0  libstdc++6  libx11-6  libx11-xcb1  libxcb1  libxcomposite1  libxcursor1  libxdamage1  libxext6  libxfixes3  libxi6  libxrandr2  libxrender1  libxss1  libxtst6  ca-certificates  fonts-liberation  libappindicator1  libnss3  lsb-release  xdg-utils  wget \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-unstable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

# When installing Puppeteer through npm, instruct it to not download Chromium.
# Puppeteer will need to be launched with:
#   browser.launch({ executablePath: 'google-chrome-unstable' })
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN mkdir -p /usr/local/src/generate-og-image
WORKDIR /usr/local/src/generate-og-image

COPY package.json package-lock.json /usr/local/src/generate-og-image/
RUN npm ci

# copy in src
COPY tsconfig.json /usr/local/src/generate-og-image/
COPY src/ /usr/local/src/generate-og-image/src/
COPY __tests__/ /usr/local/src/generate-og-image/__tests__/

RUN npm run build-release

RUN chmod +x /usr/local/src/generate-og-image/dist/index.js

ENTRYPOINT ["/usr/local/src/generate-og-image/dist/index.js"]