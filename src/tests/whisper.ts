import fs from "fs";
import openai from "../lib/openai";

(async () => {

    const fileUrl = 'C:/Users/cacho/Documentos/codigos/Github-pulls/Astrobot/src/public/audio.ogg'
    const audio = fs.createReadStream(fileUrl)
  
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
    });
  
    console.log(transcription.text)
  })()