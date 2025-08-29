FROM node:20-bullseye

RUN apt-get update && apt-get install -y chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Criar grupo gpio e adicionar usuário appuser
RUN groupadd -g 993 gpio
RUN useradd -m appuser && usermod -aG gpio appuser

USER appuser

WORKDIR /home/appuser/app

COPY --chown=appuser:appuser package*.json ./
RUN npm install

COPY --chown=appuser:appuser . .

RUN npm run build

CMD ["npm", "run", "start"]
