import tuya from './tuya'

async function getDeviceByName(nome: string): Promise<string | null> {
  try {
    const response = await tuya.request({
      method: 'GET',
      path: `/v1.0/users/${process.env.TUYA_APP_ACCOUNT_UUID}/devices`,
    });

    const devices = response.result as any[];
    const device = devices.find((d: any) => d.name.toLowerCase() === nome.toLowerCase());

    if (device) {
      return device.id;
    } else {
      console.log(`Dispositivo com nome "${nome}" não encontrado.`);
      return null;
    }
  } catch (err) {
    console.error('Erro ao buscar dispositivo:', err);
    return null;
  }
}


export default getDeviceByName