import { Client, Message } from "whatsapp-web.js";
export default async (msg: Message, params: string[], client: Client) => {
    const API_KEY = process.env.NANOGPT_API_KEY;
    const BASE_URL = 'https://nano-gpt.com/api';

    // 1) Submit
    const submitRes = await fetch(`${BASE_URL}/generate-video`, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'veo2-video',
            prompt: 'A beautiful sunset over the ocean with waves',
            duration: '5s',
            aspect_ratio: '16:9'
        })
    });
    const job = await submitRes.json();
    console.log('Submit response:', job);
    const runId = job.runId;

    // 2) Poll status
    const statusUrl = `${BASE_URL}/generate-video/status?runId=${runId}&modelSlug=veo2-video`;
    let videoUrl = null;
    for (let i = 0; i < 120; i++) {
        const r = await fetch(statusUrl, { headers: { 'x-api-key': API_KEY } });
        const s = await r.json();
        console.log('Attempt ' + (i + 1) + ': status=' + (s.data?.status || 'unknown'));
        if (s.data?.status === 'COMPLETED') {
            console.log('Completed response:', s);
            videoUrl = s.data?.output?.video?.url;
            break;
        }
        await new Promise(res => setTimeout(res, 5000));
    }

    if (videoUrl) {
        console.log('Video URL:', videoUrl);
    } else {
        console.log('Timed out without completion');
    }
}