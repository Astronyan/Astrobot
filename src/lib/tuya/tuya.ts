import { config } from "dotenv";
import { TuyaContext } from '@tuya/tuya-connector-nodejs';
config()


const accessKey = process.env.TUYA_ACESS_ID
const secretKey = process.env.TUYA_ACESS_SECRET

if (!accessKey || !secretKey) throw new Error('invalid env vars for TUYA')

const tuya = new TuyaContext({
    baseUrl: 'https://openapi.tuyaus.com',
    accessKey,
    secretKey
});

export default tuya
