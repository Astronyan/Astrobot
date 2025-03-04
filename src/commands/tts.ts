import { Message, MessageMedia } from "whatsapp-web.js";
import tts from "src/lib/elevenLabs/tts";

export default async (msg: Message, ...params: any) => {    
    const errorMessage = 'Você precisa citar a mensagem no qual quer transformar em voz ou escrever algo na frente do comando'
    if (!msg.hasQuotedMsg && (msg.body.length < 4)) return await msg.reply(errorMessage)

    const textMessage = msg.hasQuotedMsg? (await msg.getQuotedMessage()).body : msg.body

    const chat = await msg.getChat()
    chat.sendStateTyping()

    try{
        const audioBase64 = await tts(textMessage)

        const media = new MessageMedia('audio/mpeg', audioBase64)

        return await msg.reply(
            'Aqui está a conversão para audio',
            chat.id._serialized,
            { media }
        );
    } catch(err){
        console.error(err)
        msg.reply('Houve um erro ao transcrever a sua mensagem')
    }
}