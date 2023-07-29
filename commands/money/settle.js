const { SlashCommandBuilder } = require('discord.js');
const FileSystem = require("fs");

function readfile(){
    let ious = require('../../data/iou.json');
    return ious;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settle')
		.setDescription('Everything\'s settled!'),
	async execute(interaction) {
		let ious = readfile();
        ious['running_total'] = 0;
        FileSystem.writeFile('./data/iou.json', JSON.stringify(ious), (error) => {
            if (error) throw error;
        });
		return interaction.reply('Done!');
	},
};
