import { Message } from "whatsapp-web.js";

export default async (msg: Message) => {
    const content = msg.body.slice(4)
    const authorId = msg.author?? (await msg.getChat()).id._serialized
    const authorPhone = authorId.slice(0, -5)
    const chat = await msg.getChat()
    chat.sendStateTyping()

    const phoneNameMap = new Map()
    phoneNameMap.set('553588172402', 'João Pedro')
    phoneNameMap.set('553584259826', 'João Guilherme')
    phoneNameMap.set('553597627739', 'Otávio')
    phoneNameMap.set('553599966257', 'Luan')
    phoneNameMap.set('553598735539', 'Mikael')
    phoneNameMap.set('553591860682', 'Matheus')
    phoneNameMap.set('553591927474', 'Pedro Ruas')

    const chatResponse = await fetch('http://localhost:8080/tpmchat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            member: phoneNameMap.get(authorPhone),
            msg: content 
        })
    })
    .then(response => response.text())
    .then(data => data)

    msg.reply(chatResponse)
}