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
        .setName('enter')
        .setDescription('Create an entry')
        .addStringOption(option =>
            option.setName('person')
                .setDescription('Person who paid (not case sensitive)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Total Amount Paid')
                .setRequired(true))
        .addIntegerOption(option =>
                option.setName('num')
                    .setDescription('Share of person who paid')
                    .setRequired(true))
        .addIntegerOption(option =>
            option.setName('denom')
                .setDescription('Share of person who didn\'t pay')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('What did you buy?')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (!(interaction.options.getString('person').toLowerCase().valueOf() == 'ramon' || interaction.options.getString('person').toLowerCase().slice(0,4).valueOf() == 'soph')){
            await interaction.reply("Error: Invalid Person Name. Type \"Ramon\" or \"Soph\"!");
            return;
        }
        if (interaction.options.getInteger('num') + interaction.options.getInteger('denom') != 100){
            await interaction.reply("Error: Percentages " + String(interaction.options.getInteger('num'))
                + " and " +  String(interaction.options.getInteger('denom'))
                + " do not sum to 100. Try whole numbers such as 75 for Person 1 and 25 for Person 2");
            return;
        }
        var mult = 0;
        if (interaction.options.getString('person').toLowerCase() == 'ramon')
            mult = -1;
        else
            mult = 1;
        let ious = readfile();
		// const amount1 = interaction.options.getInteger('amount')*interaction.options.getInteger('num')*mult;
        const amount = interaction.options.getInteger('amount')*interaction.options.getInteger('denom')*.01*mult;
        const running_total = ious['running_total'] + amount;

        let transaction = {'person': interaction.options.getString('person').toLowerCase(),
            'amount':  interaction.options.getInteger('amount'),
            'num': interaction.options.getInteger('num'),
            'denom': interaction.options.getInteger('denom'),
            'note': interaction.options.getString('note')};


        ious['running_total'] = running_total;
        ious['history'].push(transaction)
        FileSystem.writeFile('./data/iou.json', JSON.stringify(ious), (error) => {
            if (error) throw error;
        });

        await interaction.reply("Entered " + prettify(transaction)  + " successfully! If you see a mistake, try undo.");

        // let message = "";
        // if (running_total < 0){
        //     message = "Sophia owes ";
        //     await interaction.reply({content: message + String(-1*ious["running_total"])});
        // }
        // else if (running_total > 0){
        //     message = "Ramon owes ";
        //     await interaction.reply({content: message + String(ious["running_total"])});
        // }
        // else{
        //     message = "You are settled!";
        //     await interaction.reply({content: message});
        // }
    },
}