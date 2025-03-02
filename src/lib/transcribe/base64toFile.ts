import { Readable, Transform } from "stream";

export default (base64Audio: string) => {

    const audioBuffer = Buffer.from(base64Audio, "base64");
    const audioBlob = new Blob([audioBuffer], { type: "audio/ogg" })
    const audioFile = new File([audioBlob], "audio.mp3", { type: "audio/mpeg" });

    return audioFile
}