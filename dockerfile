# Use uma imagem oficial do Node.js baseada em Debian Bullseye com suporte ARM64
FROM node:16-bullseye

# Atualiza o sistema e instala o Chromium que funciona no Raspberry Pi
RUN apt-get update && apt-get install -y chromium

# Defina a variável para Puppeteer não baixar o Chromium padrão
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Defina o caminho do Chromium instalado via apt
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Crie um usuário para rodar a aplicação sem privilégios de root
RUN useradd -m appuser
USER appuser

WORKDIR /home/appuser/app

# Copie os arquivos de dependência e instale os módulos
COPY --chown=appuser:appuser package*.json ./
RUN npm install

# Copie os arquivos do projeto para dentro da imagem
COPY --chown=appuser:appuser . .

# Execute o build (se necessário, ajuste para seu comando)
RUN npm run build

# Comando para iniciar o app
CMD ["npm", "run", "start"]