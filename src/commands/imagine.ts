import openai from "src/lib/openai";
import Whatsapp, { Client, Message } from "whatsapp-web.js";

const {MessageMedia} = Whatsapp

export default async (msg: Message, params: string[], client: Client) => {

  try {
    const chat = await msg.getChat()
    chat.sendStateTyping()

    const prompt = params[0]
    const response = await openai.images.generate({
      prompt,
      model: 'dall-e-3',
      response_format: 'b64_json'
    });

    // Save the image to a file
    const imageData = response.data
    if (!imageData || imageData.length === 0) throw new Error('imageData undefined')

    const imageBase64 = imageData[0].b64_json

    const media = new MessageMedia("image/png", imageBase64, "generated_image.png");
    chat.sendMessage(media)
  } catch (err) {
    console.log(err)
    msg.reply('Houve um erro ao gerar sua imagem')
  }
}