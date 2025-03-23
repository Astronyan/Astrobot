FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app
COPY --chown=pptruser:pptruser package*.json ./
RUN npm install
COPY --chown=pptruser:pptruser . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]

#Build:
    #docker build -t astrobot .
#Run:
    #docker run -d -v ./wwebjs_auth:/app/.wwebjs_auth --name astrobot astrobot