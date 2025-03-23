import { Message } from "whatsapp-web.js";

export default async (msg: Message) => {
    // formato "numero@c.us")
    const chat = await msg.getChat()
    const author = msg.author

    //temporary solution, since whatsapp web groupchat is not beeing recognized
    const friends = [
        "553588172402@c.us",
        "553599966257@c.us",
        "553591860682@c.us",
        "553598735539@c.us",
        "553597627739@c.us",
        "553591927474@c.us",
        "553598469178@c.us",
    ];

    if (chat.id.server !== 'g.us') {
        return msg.reply('Este comando só funciona em grupos.');
    }

    chat.sendMessage('@@', { mentions: friends });
};