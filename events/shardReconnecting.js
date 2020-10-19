const { bot } = require("../index");
const { MessageEmbed, WebhookClient } = require("discord.js")
const config = require("../Structures/jsons/config.json")

bot.on('shardReconnecting', id => {
    let hook = new WebhookClient(config.hook.id, config.hook.token)
    let embed = new MessageEmbed()
    embed.setColor(config.color)
    embed.setDescription(`Shard ${id} se reconectou`)
    hook.send(embed)
})