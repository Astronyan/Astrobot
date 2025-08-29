import OpenAI from "openai";
import { config } from "dotenv";
config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (text: string, voiceId?: string) => {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voiceId || "alloy",  // Pode substituir por vozes OpenAI disponíveis
      input: text,
      response_format: "mp3",
    });

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const base64Audio = audioBuffer.toString("base64");

    return base64Audio;
  } catch (err) {
    console.error("Error generating audio: ", err);
    return "error";
  }
};
