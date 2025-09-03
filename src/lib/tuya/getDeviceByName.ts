import tuya from './tuya'

async function getDeviceByName(nome: string): Promise<string | null> {
  try {
    const response = await tuya.request({
      method: 'GET',
      path: '/v1.0/iot-03/devices',
      query: {
        page_no: 1,
        page_size: 50,
      },
    });

    console.log(response);
    const devices = response.result?.list || [];

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