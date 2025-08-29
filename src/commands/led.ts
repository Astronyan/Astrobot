import { Gpio } from "onoff";
import { Message } from "whatsapp-web.js";

export default async (msg: Message) => {
  try {
    const LED = new Gpio(4, "out");

    const currentState = LED.readSync();
    const newState = currentState === 0 ? 1 : 0;
    LED.writeSync(newState);

    const status = newState === 1 ? "Ligado" : "Desligado";

    LED.unexport();

    return msg.reply(`LED foi ${status} com sucesso`);
  } catch (error) {
    console.error("Erro ao controlar LED:", error);
    return msg.reply("Ocorreu um erro ao tentar controlar o LED.");
  }
};
