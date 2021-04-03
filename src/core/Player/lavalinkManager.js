const { Manager } = require('erela.js');
const { MessageEmbed } = require("discord.js")
const nodes = require("./nodes")
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const logger = require("../logger")
const config = require("../../../config/config.json")

module.exports = async (client) => {

	let clientID = config.spotify.clientID
	let clientSecret = config.spotify.clientSecret

	require("./EclipsePlayer")
	client.manager = new Manager({
		nodes,
		plugins: [
			new Spotify({
				clientID,
				clientSecret
			}),
			new Deezer()
		],
		autoPlay: true,
		send(id, payload) {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	})

		.on('nodeError', (node, error) => logger.error(5, `O node ${node.options.identifier} teve o seguinte erro ao tentar conectar: ${error.message}`))
		.on('nodeConnect', node => logger.info(`Nnode ${node.options.identifier} foi conectado`))

		.on('trackStart', (player, track) => {
			const channel = client.channels.cache.get(player.textChannel);
			let lang = client.db.get(channel.guild.id) || 'pt'
			if (lang === 'en') lang = client.lang.en
			if (lang === 'pt') lang = client.lang.pt
			let embed = new MessageEmbed()
			embed.setDescription(`**${lang.erela.tocando}** \`${track.title}\``)
			embed.setTimestamp()
			embed.setColor(client.channels.cache.get(player.textChannel).guild.me.roles.highest.color)
			embed.setFooter(`${lang.erela.solicitado} ${track.requester.tag}`, `${track.requester.displayAvatarURL({ dynamic: true, size: 2048 })}`)
			channel.send(embed).then(msg => player.set("message", msg));
		})

		.on("trackEnd", (player) => {
			if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
		})

		.on('playerMove', (player, currentChannel, newChannel) => {
			player.voiceChannel = client.channels.cache.get(newChannel);
		})

		.on('socketClosed', (player, payload) => {
			if (payload.byRemote) {
				return player.destroy()
			}
		})

		.on("trackError", (player, track, payload) => {
			if (payload.type === 'TrackExceptionEvent') {
				let channel = client.channels.cache.get(player.textChannel)
				let lang = client.db.get(channel.guild.id) || 'pt'
				if (lang === 'en') lang = client.lang.en
				if (lang === 'pt') lang = client.lang.pt
				channel.send(`${lang.play.erro}: ${payload.error}`)
			}
		})

		.on("trackStuck", (player, track, payload) => {
			if (payload.type === 'TrackExceptionEvent') {
				let channel = client.channels.cache.get(player.textChannel)
				let lang = client.db.get(channel.guild.id) || 'pt'
				if (lang === 'en') lang = client.lang.en
				if (lang === 'pt') lang = client.lang.pt
				channel.send(`${lang.play.erro}: ${payload.error}`)
			}
		})

		.on("queueEnd", player => {
			const channel = client.channels.cache.get(player.textChannel);
			let lang = client.db.get(channel.guild.id) || 'pt'
			if (lang === 'en') lang = client.lang.en
			if (lang === 'pt') lang = client.lang.pt
			channel.send(lang.erela.saindo);
			player.destroy()
		});
}