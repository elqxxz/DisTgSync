require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder} = require('discord.js');
const {CommandKit} = require('commandkit');
const fs = require('fs');
const channel = require('./data/channel.json');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    bulkRegister: true,
})

let providedChannel;

client.once('ready', () => {
    console.log(`Client connected as: ${client.user.username}`);
    // console.log(JSON.parse(messageFromTg.message_id));
    providedChannel = client.channels.cache.get(`${channel.id}`);
});

let watching = false;
let watchingChannel = false;

fs.watch('src/data/channel.json', () => {
    if (watchingChannel) return;
    watchingChannel = true;

    setTimeout(() => {
        providedChannel = client.channels.cache.get(`${JSON.parse(fs.readFileSync('src/data/channel.json', 'utf-8')).id}`);
    }, 50)

    setTimeout(() => {
        watchingChannel = false;
    }, 100);
})
fs.watch(`./../TgSync/src/logs/message.json`, () => {
    if (watching) return;
    watching = true;

    setTimeout(() => {
        const parsedMsg = JSON.parse(fs.readFileSync('./../TgSync/src/logs/message.json', 'utf-8'));
        
        const msgAuthor = parsedMsg.from.first_name;
        let msgText;
        let caption;
        let attachment;

        const Embed = new EmbedBuilder()
         .setAuthor({
            name: `${msgAuthor}`
         })
         .setThumbnail(client.guilds.cache.get(process.env.GUILD_ID).iconURL())
         .setTimestamp()
        
        if (Boolean(parsedMsg.text)) {
            msgText = parsedMsg.text;
            Embed.setDescription(msgText)

            providedChannel.send({embeds: [Embed]});
        }
        if (Boolean(parsedMsg.photo) && !Boolean(parsedMsg.caption)) {
            attachment = new AttachmentBuilder(`./../TgSync/imgs/${parsedMsg.from.id}.jpg`);
            Embed.setImage(`attachment://${parsedMsg.from.id}.jpg`);

            providedChannel.send({embeds: [Embed], files: [attachment]})
        } else if (Boolean(parsedMsg.photo) && Boolean(parsedMsg.caption)) {
            caption = parsedMsg.caption;
            attachment = new AttachmentBuilder(`./../TgSync/imgs/${parsedMsg.from.id}.jpg`);
            Embed.setImage(`attachment://${parsedMsg.from.id}.jpg`);
            Embed.setDescription(`${caption}`)

            providedChannel.send({embeds: [Embed], files: [attachment]})
        }

    }, 2000);
    
    // console.log(msgText, msgAuthor);
    // console.log(messg.text())

    // const Embed = new EmbedBuilder()
    // .setAuthor({
    //     name: `${messageAuthor}`
    // })
    // .setThumbnail(client.guilds.cache.get(process.env.GUILD_ID).iconURL())
    // .setTimestamp()
    // console.log(messageText)

    setTimeout(() => {
        watching = false;
    }, 2100);
})

client.login(process.env.DS_BOT_TOKEN);