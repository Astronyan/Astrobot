import { readdirSync, readFileSync } from 'fs';
import path, { dirname } from 'path';
import qrcode from 'qrcode-terminal';
import { fileURLToPath, pathToFileURL } from 'url';
import WhatsApp from 'whatsapp-web.js'; // Importa como default

// Desestruturar os componentes necessários
const { Client, LocalAuth } = WhatsApp;

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (msg) => {
  const commandName = msg.body.split(' ')[0]
  const commandPath = path.resolve(__dirname, 'commands', `${commandName}.js`);

  // Converter o caminho do arquivo em URL
  const commandUrl = pathToFileURL(commandPath).href;

  try {
    const command = await import(commandUrl);
    command.default(msg);
  } catch (err) {
    console.error(err)
    if(msg.body.startsWith('!'))
      await msg.reply(`Não existe o comando ${commandName}`);
  }
});

client.initialize();