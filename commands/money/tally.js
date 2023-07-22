const { SlashCommandBuilder } = require('discord.js');
const FileSystem = require("fs");

function readfile(){
    let ious = require('../../data/iou.json');
    return ious;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tally')
		.setDescription('Who owes what?'),
	async execute(interaction) {
		let ious = readfile();
        let message = "";
		let running_total = ious['running_total'];
        if (running_total < 0){
            message = "Sophia owes ";
            await interaction.reply({content: message + String(-1*ious["running_total"])});
        }
        else if (running_total > 0){
            message = "Ramon owes ";
            await interaction.reply({content: message + String(ious["running_total"])});
        }
        else{
            message = "You are settled!";
            await interaction.reply({content: message});
        }
	},
};