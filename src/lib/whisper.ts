import { Uploadable } from "openai/uploads";
import openai from "./openai";
import fs from 'node:fs'

export default async (audio: File) => {

  const transcription = await openai.audio.transcriptions.create({
    file: audio,
    model: "whisper-1",
  });

  return transcription.text
}