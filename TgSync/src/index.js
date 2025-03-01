require('dotenv').config();
const { Telegraf, Telegram } = require('telegraf');
const fs = require('fs')
const axios = require('axios')

const bot = new Telegraf(process.env.TG_BOT_TOKEN);

bot.start(() => {
    console.log("activated")
})

bot.launch(console.log('bot started!'));

bot.on('message', (ctx) => {
    let textMessage = ctx.message.text;
    console.log(ctx.message,`\n ${Array(ctx.message.photo).length}`)
    if (Boolean(ctx.message.photo)) {
        const fileId = ctx.message.photo[2].file_id;
        console.log(fileId);
        ctx.telegram.getFileLink(fileId).then(url => {    
            axios({url, responseType: 'stream'}).then(response => {
                return new Promise((resolve, reject) => {
                    response.data.pipe(fs.createWriteStream(`./imgs/${ctx.update.message.from.id}.jpg`))
                     .on('finish', () => console.log('file is saved'))
                     .on('error', e => console.log(`error in saving file!\n ${e}`))
                });
            })
        })
        Boolean(ctx.message.caption)? textMessage = ctx.message.caption : textMessage = '\x1b[33mnull\x1b[0m';
    }
    console.log(`\x1b[32mnew message >>>>\x1b[0m\n from: ${ctx.message.from.first_name}\n message: ${textMessage}\n have photo: ${Boolean(ctx.message.photo)}\n date: ${new Date(ctx.message.date * 1000)}`);
    const messageJSON = JSON.stringify(ctx.message);
    fs.writeFile(`./src/logs/message.json`, `${messageJSON}\n`, (err) => {
        if (err) console.log(`error in writing message to file!\n ${err}`);
    });
})

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));