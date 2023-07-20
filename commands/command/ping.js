const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('try again'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};