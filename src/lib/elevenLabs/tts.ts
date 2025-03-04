import { ElevenLabsClient, play } from "elevenlabs";
import { config } from "dotenv";
config()

export default async (text: string, voiceId: string = '7u8qsX4HQsSHJ0f8xsQZ' )=> {

    try{

        const client = new ElevenLabsClient({apiKey: process.env.ELEVENLABS_APi_KEY});
        const audio = await client.textToSpeech.convert(voiceId, {
            output_format: "mp3_44100_128",
            text,
            model_id: "eleven_flash_v2_5"
        });

        const buffers: Buffer[] = [];
        for await (const chunk of audio) {
            buffers.push(chunk);
        }
        const audioBuffer = Buffer.concat(buffers);
        const base64Audio = audioBuffer.toString('base64');

        return base64Audio;
    } catch(err){
        console.error('Error generating audio: ' + err)
        return 'error'
    }
}
