import { ElevenLabsClient, play } from "elevenlabs";
import { config } from "dotenv";
config()

const client = new ElevenLabsClient({apiKey: process.env.ELEVENLABS_APi_KEY});
const audio = await client.textToSpeech.convert("URXOh18jLjjB8SVVZjA0", {
  text: "manos tava pensando aq, vai ter um bgl na faculdade quinta tipo um concurso de fantasia de carnaval (tema é celebridades ou personagens) do meu curso ne.",
  model_id: "eleven_multilingual_v2",
  output_format: "mp3_44100_128",
});

await play(audio);