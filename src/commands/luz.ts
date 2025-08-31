import { Message } from "whatsapp-web.js";
import { config } from "dotenv";
import tuya from '../lib/tuya/tuya'
import getDeviceByName from "src/lib/tuya/getDeviceByName";
config()

// Mapeamento simples de nome de cor para valores HSV/RGB Tuya
const colorMap: Record<string, { h: number, s: number, v: number }> = {
  vermelho: { h: 0, s: 1000, v: 1000 },
  azul: { h: 240, s: 1000, v: 1000 },
  verde: { h: 120, s: 1000, v: 1000 },
  amarelo: { h: 60, s: 1000, v: 1000 },
  branco: { h: 0, s: 0, v: 1000 },
  // adicione mais conforme necessidade
};

export default async (msg: Message, params: string[]) => {
  const [name, state] = params;

  let action: boolean | undefined;
  let cor: { h: number, s: number, v: number } | undefined;

  if (state === "ligado" || state === "on") action = true;
  else if (state === "desligado" || state === "off") action = false;
  else if (state in colorMap) {
    action = true;               // ao receber cor, pressupõe ligar
    cor = colorMap[state];
  }

  if (action === undefined && cor === undefined) {
    await msg.reply(`Ação desconhecido. Use: 'ligar', 'desligar' ou uma cor suportada: (${Object.keys(colorMap)})`);
    return;
  }

  try {
    const deviceId = await getDeviceByName(name);
    if (!deviceId) {
      await msg.reply("Dispositivo não encontrado.");
      return;
    }

    const commands = [];

    // Prioriza ação ligar/desligar
    if (action !== undefined) {
      commands.push({ code: "switch_led", value: action });
    }

    // Se cor foi especificada, envia comando
    if (cor) {
      commands.push({ code: "colour_data_v2", value: cor });
      // Algumas lâmpadas podem usar "colour_data" ou RGB; verifique na documentação do produto Tuya
    }

    await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: { commands },
    });

    if (cor) {
      await msg.reply(`Luz ligada e cor alterada para ${state}`);
    } else {
      await msg.reply(`Luz ${action ? "ligada" : "desligada"} com sucesso`);
    }
  } catch (err) {
    console.error("Erro ao alternar luz:", err);
    await msg.reply(`Houve um erro ao processar seu comando.`);
  }
};
