import { Message } from "whatsapp-web.js";

export default async (msg: Message, ...params: any) => {
    msg.reply('pong')
}