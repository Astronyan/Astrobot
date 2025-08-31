import qrcode from 'qrcode-terminal';

export default async (qr: string) => {
    qrcode.generate(qr, { small: true });
}