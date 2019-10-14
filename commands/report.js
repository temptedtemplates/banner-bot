const Discord = require('discord.js');

module.exports.run = async(bot,msg,args) => {
    const reported = msg.mentions.members.first();
    if (!reported) {
        msg.channel.send("Check the mentioned user!");
        msg.delete(1000);
        return;
    }

    let reason = args.join(" ").slice(22);
    const reportingEmbed = new Discord.RichEmbed()
    .setAuthor('SweetSpot', 'https://i.imgur.com/WkHhB5P.png')
    .setColor('#03d3fc')
    .addField('Reporter', msg.author.username)
    .addField('Reported', reported.user.username)
    .addField('Reason', reason);
    const reportChannel = msg.guild.channels.find("name", "reports");

    reportChannel.sendMessage(reportingEmbed);
    msg.delete(1000);
}

module.exports.help = {
    name: "report"
}