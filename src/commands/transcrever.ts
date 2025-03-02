import { Message } from "whatsapp-web.js";
import whisper from "../lib/whisper";
import base64toFile from "../lib/transcribe/base64toFile";

export default async (msg: Message, ...params: any) => {

    
    if (!msg.hasQuotedMsg) return await msg.reply('Você precisa citar o audio no qual quer transcrever. Você não citou nenhum mensagem')

    const quotedMessage = await msg.getQuotedMessage()
    const audioMedia = await quotedMessage.downloadMedia()
    if (!quotedMessage.hasMedia || !audioMedia.mimetype || !audioMedia.mimetype.startsWith('audio/ogg'))
     return await msg.reply('A mensagem que você mencionou não possui nenhum audio anexado')

    const chat = await msg.getChat()
    chat.sendStateTyping()

    const audioBase64 = audioMedia.data
    const audioFile = base64toFile(audioBase64)

    try{
        const transcribedAudio = await whisper(audioFile)
        msg.reply(transcribedAudio)
    } catch(err){
        console.error(err)
        msg.reply('Houve um erro ao transcrever a sua mensagem')
    }
}