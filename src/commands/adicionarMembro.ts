import { readFileSync, writeFileSync } from "fs"
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

    if(!receivedFile){
        const exampleCsvPath = path.join(__dirname, '../public/members-example.csv');
        const base64ExampleCsv = readFileSync(exampleCsvPath, 'base64');
        
        // Crie a mídia que será enviada como resposta
        const media = new MessageMedia('text/csv', base64ExampleCsv, 'Planilha-de-exemplo.csv')
        
        // Responder à mensagem com o arquivo CSV de exemplo anexado
        return await msg.reply(
            'Você precisa anexar uma planilha CSV para poder adicionar membros. Aqui vai uma planilha exemplo para você preencher:',
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

            const configPath = path.resolve(__dirname, '../public/config.json');
            const config = readFileSync(configPath, 'utf-8')
            const parsedConfig = JSON.parse(config)
        
            const oldMembers: Member[] = parsedConfig.members
            const allMembers = [...oldMembers, ...members]
            parsedConfig.members = allMembers
        
            const newConfig = JSON.stringify(parsedConfig, null, '/t')
            writeFileSync(configPath, newConfig)
        });
}