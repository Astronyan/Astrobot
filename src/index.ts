import { readdirSync, readFileSync } from 'fs';
import path, { dirname } from 'path';
import qrcode from 'qrcode-terminal';
import { fileURLToPath, pathToFileURL } from 'url';
import WhatsApp from 'whatsapp-web.js'; // Importa como default

// Desestruturar os componentes necessários
const { Client, LocalAuth } = WhatsApp;

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
  client.getChatById
});

client.on('message', async (msg) => {
  const commandName = msg.body.split(' ')[0].toLowerCase()
  const commandPath = path.resolve(__dirname, 'commands', `${commandName}.js`);

  // Converter o caminho do arquivo em URL
  const commandUrl = pathToFileURL(commandPath).href;

  try {
    let command = await import(commandUrl);
    //if(commandName === 'stt') command = await import(pathToFileURL())
    command.default(msg, client);
  } catch (err) {
    console.error(err)
    if(msg.body.startsWith('!'))
      await msg.reply(`Não existe o comando ${commandName}`);
  }
});

client.initialize();