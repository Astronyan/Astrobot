import { Message } from "whatsapp-web.js";

export default async (msg: Message) => {
    // formato "numero@c.us")
    const chat = await msg.getChat()
    const friends = [
        "5535988172402@c.us", 
        "554198319566@c.us", 
        "5511999999999@c.us" 
    ];

    if (chat.id.server !== 'g.us') {
        return msg.reply('Este comando só funciona em grupos.');
    }

    chat.sendMessage('opa eae @5535988172402@c.us', { mentions: friends });
};