module.exports.run = async(bot, msg,args) => {
    return msg.channel.send("Online!");
}

module.exports.help = {
    name: "ping"
}