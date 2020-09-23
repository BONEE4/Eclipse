const Discord = require('discord.js')
const config = require("../config.json")

module.exports.run = async (bot, message, args) => {
var ids = ["672652538880720896"]
if (ids.includes (message.author.id)) {
  
        try {
            if(!args.join(' ')) return message.reply('Esvreve ai')
            let code = await eval(args.join(" "));

            if (typeof code !== 'string') code = await require('util').inspect(code, { depth: 0 });
            let embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .addField('📩Entrada', `\`\`\`js\n${args.join(" ")}\`\`\``)
            .addField('🚩Saída', `\`\`\`js\n${code}\n\`\`\``)
            message.reply(embed)
        } catch(e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
}
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliase:["ev", "e"]
}

exports.help = {
  nome: "eval",
  descrição: "Roda codigos",
  uso: "eval <CODIGO>",
  categoria: "Outros"
}