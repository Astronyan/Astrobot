import { readFileSync, writeFileSync, writeFile } from "fs"
import path from "path";
import { Readable } from "stream";
import { Message, MessageMedia } from "whatsapp-web.js";
import csv from 'csv-parser'

type Member = {
    name?: string,
    phone: number,
    birth?: string,
    cleaningDay?: string
}

export default async (msg: Message) => {

    const receivedFile = await msg.downloadMedia()
    const chat = await msg.getChat()
    const csvPath = path.join(__dirname, '../public/members.csv');

    if(!receivedFile){
        const base64Csv = readFileSync(csvPath, 'base64');
        
        // Crie a mídia que será enviada como resposta
        const media = new MessageMedia('text/csv', base64Csv, 'Planilha-de-exemplo.csv')
        
        // Responder à mensagem com o arquivo CSV de exemplo anexado
        return await msg.reply(
            'Anexe uma planilha CSV para poder alterar os membros. Esta é a planilha dos membros atuais. Baixe-á, edite-á e anexe-á utilizando este comando (membros)',
            chat.id._serialized,
            { media }
        );

    }

    // Converter base64 para texto
    const csvBuffer = Buffer.from(receivedFile.data, 'base64');
    const csvText = csvBuffer.toString('utf-8');

    // Criar um stream de leitura a partir do texto CSV
    const stream = Readable.from(csvText);

    // Parsear o CSV
    const results: any[] = [];
    stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            
            const members: Member[] = results.map(result => ({
                phone: result['telefone'],
                name: result['nome']?? undefined,
                birth: result['nascimento']?? undefined,
                cleaningDay: result['dia de limpeza']?? undefined,
            }))

            writeFile(csvPath, csvBuffer, (err) => {
                if (err) {
                    console.error('Erro ao substituir o arquivo CSV:', err);
                    return msg.reply('Erro ao editar a planilha de membros')
                } else {
                    console.log('Arquivo CSV substituído com sucesso!');
                }
            });

            const configPath = path.resolve(__dirname, '../public/config.json');
            const config = readFileSync(configPath, 'utf-8')
            const parsedConfig = JSON.parse(config)
        
            const oldMembers: Member[] = parsedConfig.members?? []
            const allMembers = [...oldMembers, ...members]
            parsedConfig.members = allMembers
        
            const newConfig = JSON.stringify(parsedConfig, null, 4)
            writeFileSync(configPath, newConfig)
        });

        await msg.reply('Membros alterados com sucesso!')
}