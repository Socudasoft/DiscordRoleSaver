const Discord = require('discord.js');
const bot = new Discord.Client();
const {token, prefix} = require("./config");
const fs = require('fs');

bot.on("ready", () => {
    console.log(bot.user.tag + " prêt à ban Wassim");
});

bot.on("message", msg => {
    if (msg.content.startsWith(prefix) && msg.member) {
        commandProcess(msg);
    }
})

function commandProcess(msg){
    let rawCommand = msg.content;
    let fullCommand = rawCommand.substr(prefix.length);
    let splitCommand = fullCommand.split(' ');
    splitCommand = splitCommand.filter(function(e){return e});
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);


    if (!msg.member.permissions.has(8)) {
        msg.reply("tu n'as pas les perms, misérable geux");
        return;
    }


    switch (primaryCommand.toLowerCase()) {
        case 'save':
            saveRoles(msg);
            break;
        case 'load':
            loadRoles(msg);
            break;
        default:
            msg.reply("this command doesn't exist.");
    }
}

function saveRoles(msg){
    let member = msg.mentions.members.first();
    if (!member) { msg.reply("aucun debilus portant ce pseudo trouvé, Cheh !").catch(console.error); return; }
    let roles = member._roles;
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) throw err;
        if (data === "") return;
        let json = JSON.parse(data);
        if (json[member.user.id] === undefined) json[member.user.id] = {};
        json[member.user.id][member.guild.id] = roles;
        fs.writeFile('data.json', JSON.stringify(json), (err) => {
            if (err) throw err;
            msg.reply("Les rôles de ce fils de pute de <@" + member.user.id + "> ont bien été save").catch(console.error);
        });
    });
}

function loadRoles(msg){
    let member = msg.mentions.members.first();
    if (!member) {msg.reply("aucun membre trouvé nullos !").catch(console.error); return}
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) throw err;
        if (data === "") return;
        let json = JSON.parse(data);
        let roles = json[member.user.id][member.guild.id];
        member.roles.remove(member._roles).catch(console.error);
        member.roles.add(roles).catch(console.error);

        msg.reply("les rôles de <@" + member.user.id + "> la sale merde ont bien été chargés ! https://tenor.com/view/sardoche-sale-merde-bestof-transition-shit-gif-17260143").catch(console.error);
    });
}

bot.login(token).catch(console.error);