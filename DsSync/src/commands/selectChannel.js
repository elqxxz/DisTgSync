const {ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const fs = require('fs')

/** @type {import('commandkit').CommandData} */

const data = {
    name: 'select-channel',
    description: 'Select a channel for messages',
    options: [
        {
            name: 'channel',
            description: 'Channel to send the message in',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ]
};

/** @param {import('commandkit').SlashCommandProps} param0 */

function run({interaction, client}) {
    const channel = interaction.options.getChannel('channel');
    if (!channel) return interaction.reply({ content: 'Invalid channel provided.', flags: 'Ephemeral' });

    let botPfp = client.user.avatarURL()? client.user.avatarURL() : interaction.guild.iconURL();

    const successEmbed = new EmbedBuilder()
     .setTitle('Channel selected!')
     .setDescription(`> Selected channel: <#${channel.id}>`)
     .setAuthor({
        name: `${client.user.username}`,
        iconURL: `${botPfp}`
     })
     .setTimestamp();
    
    fs.writeFile('./src/data/channel.json', `${JSON.stringify(channel)}`, (err) => {
        if (err) console.log(`error in writing message to file!\n ${err}`);
    });
    
    interaction.reply({ embeds: [successEmbed], flags: 'Ephemeral' });
};

/** @type {import('commandkit').CommandOptions} */

const options = {
    devOnly: false,
};

module.exports = { data, run, options}