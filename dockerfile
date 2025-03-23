FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Define o Chrome da imagem como executável padrão
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chrome

# Copia os arquivos de dependências com permissões corretas
COPY --chown=pptruser:pptruser package*.json ./

# Instala dependências sem baixar Chromium extra
RUN npm install

# Copia o projeto
COPY --chown=pptruser:pptruser . .

# Faz o build
RUN npm run build

CMD ["npm", "run", "start"]

#Build:
    #docker build -t astrobot .
#Run:
    #docker run -d --init --cap-add=SYS_ADMIN -v ./wwebjs_auth:/app/.wwebjs_auth --name astrobot astrobot