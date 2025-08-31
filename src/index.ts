import { readdirSync, readFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import WhatsApp from 'whatsapp-web.js'; // Importa como default
import { config } from 'dotenv';
config()

// Desestruturar os componentes necessários
const { Client, LocalAuth } = WhatsApp;

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  authStrategy: new LocalAuth(),
});

const eventsPath = path.resolve(__dirname, 'events')
const eventsName = readdirSync(eventsPath).map(file => file.slice(0, -3)) //removing extension (.js)
const availableEvents = new Set(eventsName)

for (const eventName of availableEvents) {
  const eventPath = path.resolve(__dirname, 'events', `${eventName}.js`);
  const eventUrl = pathToFileURL(eventPath).href;

  try {
    const event = await import(eventUrl);
    client.on(eventName, (...args) => {
      event.default(...args, client)
    })
  } catch (err) {
    console.error(err)
  }
}

client.initialize();