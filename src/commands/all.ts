import { Message, GroupChat } from "whatsapp-web.js";

export default async (msg: Message) => {
    // formato "numero@c.us")
    const chat = await msg.getChat() as GroupChat
    
        if (chat.id.server !== 'g.us') {
            return msg.reply('Este comando só funciona em grupos.');
        }

    const friends = chat.participants.map(user => user.id._serialized)

    chat.sendMessage('', { mentions: friends });
};