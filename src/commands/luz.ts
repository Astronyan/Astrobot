import { Message } from "whatsapp-web.js";
import { config } from "dotenv";
import tuya from '../lib/tuya/tuya'
config()

export default async (msg: Message) => {

    const action = msg.body.split(' ')[1].toLowerCase() === 'ligar'? true : false

    try {

        async function alternarLuz(deviceId: string, estado: boolean) {
            // Envia comando para desligar a luz - geralmente um comando switch_led com valor false
            const result = await tuya.request({
                method: 'POST',
                path: `/v1.0/iot-03/devices/${deviceId}/commands`,
                body: {
                    commands: [
                        {
                            code: 'switch_led',
                            value: estado,
                        },
                    ],
                },
            });
        }

        await alternarLuz('eb79ac664732562ecezxaq', action);

        msg.reply('Luz ' + (action? 'ligada' : 'desligada') + ' com sucesso')
    } catch (err) {
        console.error('Erro ao alternar luz:', err);
        msg.reply('Houve um erro em ' +(action? 'ligar' : 'desligar') + 'a luz')
    }
};
