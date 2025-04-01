import { GroupChat, Message } from "whatsapp-web.js";

export default async (msg: Message) => {
    // formato "numero@c.us")
    const chat = await msg.getChat() as GroupChat
    const {participants} = chat
    const mentions = participants.map(participant => participant.id._serialized)

    if (chat.id.server !== 'g.us') {
        return msg.reply('Este comando só funciona em grupos.');
    }

    chat.sendMessage('@@', { mentions: [...mentions] });
};