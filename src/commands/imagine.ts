import openai from "src/lib/openai";
import { Message } from "whatsapp-web.js";

export default async (msg: Message) => {

    const prompt = msg.body

    const response = await openai.responses.create({
        model: "gpt-5",
        input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",
        tools: [{type: "image_generation"}],
    });
    
    // Save the image to a file
    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);
    
    if (imageData.length > 0) {
      const imageBase64 = imageData[0];
      const fs = await import("fs");
      fs.writeFileSync("otter.png", Buffer.from(imageBase64, "base64"));
    }
}