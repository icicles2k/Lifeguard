require('dotenv').config();
const { Collection, EmbedBuilder } = require('discord.js');
const { formatCooldown } = require('../functions/cooldown-formatter');
const config = require('../../config');

async function handleMessage(message, client) {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!config.owners.includes(message.author.id)) {
        if (command.owner && !config.owners.includes(message.author.id)) {
            return message.delete();
        }

        if (command.staff && !config.staff.includes(message.author.id)) {
            return message.delete();
        }
    }

    if (!client.cooldowns) {
        client.cooldowns = new Collection();
    }

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldown = (command.cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expires = timestamps.get(message.author.id) + cooldown;

        if (now < expires) {
            const timeLeft = formatCooldown((expires - now) / 1000);
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription(`You may use the \`${command.name}\` command again in **${timeLeft}**.`)
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                message.delete();
                msg.delete();
            }, 3000);

            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldown);

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        return message.reply(`An error occurred while running this command: \`${error}\``);
    }
};

module.exports = { handleMessage };