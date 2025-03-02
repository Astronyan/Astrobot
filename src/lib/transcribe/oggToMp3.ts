// import { Readable } from "stream";
// import ffmpeg from "fluent-ffmpeg";
// import ffmpegPath from "@ffmpeg-installer/ffmpeg";
// import { File } from "buffer"; // Se estiver usando Node 20+

// ffmpeg.setFfmpegPath(ffmpegPath.path);

// export default (base64Audio: string) => {

//     const audioBuffer = Buffer.from(base64Audio, "base64");

//     return new Promise((resolve, reject) => {
//         const audioBuffer = Buffer.from(base64Audio, "base64");

//         // Criar um stream de leitura do buffer
//         const inputStream = new Readable();
//         inputStream.push(audioBuffer);
//         inputStream.push(null);

//         // Buffer de saída
//         let outputBuffer = Buffer.alloc(0);

//         const ffmpegProcess = ffmpeg()
//             .input(inputStream)
//             .inputFormat("ogg")
//             .audioCodec("libmp3lame") // Converte para MP3
//             .toFormat("mp3")
//             .on("error", (err: unknown) => reject(err))
//             .on("data", (chunk: Uint8Array) => {
//                 outputBuffer = Buffer.concat([outputBuffer, chunk]);
//             })
//             .on("end", () => {
//                 // Criando um objeto File para a API da OpenAI
//                 const audioFile = new File([outputBuffer], "audio.mp3", { type: "audio/mpeg" });
//                 resolve(audioFile);
//             });

//         ffmpegProcess.pipe();
//     });
// }
