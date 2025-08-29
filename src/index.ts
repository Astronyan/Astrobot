import { readdirSync, readFileSync } from 'fs';
import path, { dirname } from 'path';
import qrcode from 'qrcode-terminal';
import { fileURLToPath, pathToFileURL } from 'url';
import WhatsApp from 'whatsapp-web.js'; // Importa como default
import { config } from 'dotenv';
config()

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

const commandsPath = path.resolve(__dirname, 'commands')
const commandsNames = readdirSync(commandsPath).map(file => file.slice(0, -3)) //removing extension (.js)
const availableCommands = new Set(commandsNames)
client.on('message', async (msg) => {
  if(process.env.NODE_ENV === 'development'){
    const chat = await msg.getChat()
    if(chat.name !== '8') return
  }
  const firstWord = msg.body.split(' ')[0].toLowerCase()
  const hasPrefix = firstWord.startsWith('!')

  const commandName = hasPrefix? firstWord.slice(1) : firstWord
  if(!availableCommands.has(commandName)){
    if(hasPrefix) await msg.reply(`Não existe o comando ${commandName}`);
    return
  }
  const commandPath = path.resolve(__dirname, 'commands', `${commandName}.js`);
  const commandUrl = pathToFileURL(commandPath).href;

  try {
    const command = await import(commandUrl);
    command.default(msg, client);
  } catch (err) {
    console.error(err)
  }
});

client.initialize();