const Discord = require('discord.js');
const fs = require('fs');
var mysql = require('mysql');
const bot = new Discord.Client();
var prefix = "ss!";

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if (jsfiles.length <= 0) return console.log("No commands");

    console.log(`Loading ${jsfiles.length}`);
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} has been loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("message", (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;

    let messageArray = msg.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, msg, args);
});

bot.on("ready", () => {
    console.log("SweetSpot bot is online");
    bot.user.setActivity(`over Sweetspot`, { type: "WATCHING" });
    idx = setInterval(function() {
        var con = mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.db
        });
        con.connect(function(err) {
            var notRan = false;
            var kickP = "";
            con.query("SELECT * FROM ss_bans", function (err, result, fields) {
                for (i = 0; i < result.length; i++) {
                    if (result[i].BANNED == 1) {
                        bot.guilds.map((c) => {
                            c.members.map((c) => {
                                if (result[i].NAME == c.user.username) {
                                    c.ban(result[i].REASON);
                                }
                            });
                        });
                    }
                }
            });
            con.query("SELECT * FROM ss_kicks", function(err, result, fields){
                if (result[result.length - 1].RAN == 0) {
                    bot.guilds.map((c) => {
                        c.members.map((c) => {
                            if (result[result.length - 1].NAME == c.user.username) {
                                c.kick("No reason needed");
                                kickP = result[result.length - 1].NAME
                                changeRan(kickP);
                            }
                        });
                    });
                }
            });
            function changeRan(kickP) {
                con.query(`UPDATE ss_kicks SET RAN = 1 WHERE NAME = '${kickP}'`, function (err, result) {
                    if (err) throw err;
                    console.log("Changed ran value");
                });
            }
        });
        setTimeout(() => {
            con.end();
        }, 5000);
    }, 5000);
});

bot.token = process.env.token;
bot.login();