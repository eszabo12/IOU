const { transcode } = require('buffer');
const { SlashCommandBuilder } = require('discord.js');
const FileSystem = require("fs");

function readfile(){
    let ious = require('../../data/iou.json');
    return ious;
}
function prettify(dict){
    return dict['person'] + " "+ String(dict['num']) + '/' + String(dict['denom']) + " note: " + dict['note'];
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('undo')
		.setDescription('Undo the last transaction- in case a mistake was made!'),
	async execute(interaction) {
		let ious = readfile();
        let transaction = ious['history'].pop();
        var mult = 0;
        if (transaction['person'].toLowerCase() == 'ramon')
            mult = -1;
        else
            mult = 1;
        const amount = transaction['amount']*transaction['denom']*.01*mult;
        ious['running_total'] -= amount;
        FileSystem.writeFile('./data/iou.json', JSON.stringify(ious), (error) => {
            if (error) throw error;
        });
		return interaction.reply('Undid transaction: ' + prettify(transaction));
	},
};