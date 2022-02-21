const Discord = require('discord.js')
const bot = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"] });
const moment = require('moment')
const db = require('quick.db')
require('discord-reply')
const fs = require('fs')
const ms = require('ms')
require("dotenv")
const keepAlive = require('./server.js')
keepAlive()
const invites = {};
const wait = require('util').promisify(setTimeout);
const Data = new Discord.Collection();
const discordButtons = require("discord-buttons-plugin");
const buttonClient = new discordButtons(bot)
require('discord-buttons')(bot);
let Enmap = require("enmap")
let canvacord = require("canvacord")
bot.points = new Enmap({ name: "points" })
const enmap = require('enmap');
const fetch = require("node-fetch");
const cooldown = new Set();


bot.login('OTQ1MjA5MTI4NDUwNjU0MjM4.YhM0mQ.AjkMR0MYqTXY9qM9_q0c7ydRZq0')

const prefix = "-"

bot.on('ready', () => {
  console.log("Online")
});


// User
bot.on("message", message => {
  let command = message.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);
  if (command == "user" || command == "يوزر") {
      var userr = message.mentions.users.first() || message.author;
      var memberr = message.mentions.members.first() || message.member;
      let userinfo = userr.displayAvatarURL({ size: 2048, dynamic: true });
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(userr.username, userr.avatarURL({ dynamic: true }))
        .setThumbnail(userinfo)
        .addField(`تاريخ دخول دسكورد :`, `\`${moment(userr.createdAt).format('YYYY/M/D')} ${moment(userr.createdAt).format('LTS')}\`\n**${moment(userr.createdAt, "YYYYMMDD").fromNow()}**`, true)
        .addField(`تاريخ دخول السيرفر :`, `\`${moment(memberr.joinedAt).format('YYYY/M/D')} ${moment(memberr.joinedAt).format('LTS')}\`\n**${moment(memberr.joinedAt, "YYYYMMDD").fromNow()}**`, true)
        .setFooter(userr.tag, userr.avatarURL({ dynamic: true }))
      message.channel.send(embed)
    }
  })


  // Avatar
  bot.on('message', message => {

    let command = message.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);
  if (command == "avatar" || command == "افاتار") {
      let args = message.content.substring(prefix.length).split(" ");
  
      const user = message.mentions.users.first()
      if (!user && !args[1]) {
  
        const uavatar = message.author.avatarURL({ size: 4096, dynamic: true })
        const embed3 = new Discord.MessageEmbed()
          .setTitle(`${message.member.user.username} avatar`)
          .setDescription(`[Avatar URL of **${message.member.user.username}**](${uavatar})`)
          .setColor('BLACK')
          .setImage(uavatar)
        message.channel.send(embed3)
      }
      if (args[1] === 'server') {
  
        const savatar = message.guild.iconURL({ size: 4096, dynamic: true })
        const embed2 = new Discord.MessageEmbed()
          .setTitle(`${message.guild.name} avatar`)
          .setDescription(`[Avatar URL of **${message.guild.name}**](${savatar})`)
          .setColor('BLACK')
          .setImage(savatar)
        message.channel.send(embed2)
  
      }
      if (user) {
        const avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
  
  
        const embed = new Discord.MessageEmbed()
          .setTitle(`${user.username} avatar`)
          .setDescription(`[Avatar URL of **${user.username}**](${avatar})`)
          .setColor('BLACK')
          .setImage(avatar)
        message.channel.send(embed)
      }
    }
  })


  // Anti - Link
  bot.on("message", async message => {
    if (message.content.includes("https://") || message.content.includes("http://") || message.content.includes("discord.gg")) {
      if (message.member.hasPermission("MANAGE_MESSAGES")) return;
      if (!message.channel.guild) return;
      if (message.channel.guild === "أيدي الروم") return;
      message.author.send("⚠️ **`تحذير شفهي لك السبب : نشر روابط`**");
      message.delete();
    }
  });


  // Clear Chat
  bot.on("message", async message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "clear" || command == "مسح") {
      message.delete({ timeout: 0 })
      if (!message.channel.guild) return message.reply(`** هذا الامر فقط في السيرفرات**`);
      if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
      if (!message.guild.member(bot.user).hasPermission('MANAGE_GUILD')) return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(` **ليس لدي صلاحية **`))
  
      let args = message.content.split(" ").slice(1)
      let messagecount = parseInt(args);
      if (args > 100) return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`\`\`\`js
        لا يمكنني الحذف اكثر من 100 رسالة  
        \`\`\``)
      ).then(messages => messages.delete({ timeout: 5000 }))
      if (!messagecount) messagecount = '100';
      message.channel.messages.fetch({ limit: 100 }).then(messages => message.channel.bulkDelete(messagecount)).then(msgs => {
        message.channel.send(
          new Discord.MessageEmbed()
            .setDescription(`\`\`\`js
                      ${msgs.size} تم مسح الرسائل\`\`\``)
        ).then(messages =>
          messages.delete({ timeout: 5000 }));
      })
    }
  });


  // Open Chat And Close Channel
  bot.on("message", async message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "قفل" || command == "lock") {
      if (!message.channel.guild || message.author.bot) return;
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(
        new Discord.MessageEmbed()
          .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
      const role = message.guild.roles.cache.find(role => role.name === '@everyone')
      message.channel.updateOverwrite(role, { 'SEND_MESSAGES': false })
      message.lineReply(new Discord.MessageEmbed()
        .setDescription(`**تم غلق الروم ** <#${message.channel.id}> `)
        .setColor('RED'))
    }
  })

  bot.on("message", async message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "فتح" || command == "open") {
      if (!message.channel.guild || message.author.bot) return;
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(
        new Discord.MessageEmbed()
          .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
      const role = message.guild.roles.cache.find(role => role.name === '@everyone')
      message.channel.updateOverwrite(role, { 'SEND_MESSAGES': true })
      message.lineReply(new Discord.MessageEmbed()
        .setDescription(`**تم فتح الروم** <#${message.channel.id}> ✅`)
        .setColor("GREEN"))
    }
  })


  // Hide And Show Channel
  bot.on("message", async message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "اخفاء" || command == "hide") {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(
        new Discord.MessageEmbed()
          .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
      if (!message.channel.guild) return;
      const role = message.guild.roles.cache.find(role => role.name === '@everyone')
      message.channel.updateOverwrite(role, { 'VIEW_CHANNEL': false })
      message.lineReply(new Discord.MessageEmbed()
        .setDescription(`** تم اخفاء الروم <#${message.channel.id}> 🔒**`)
        .setColor('RED'))
    }
  });
  
  bot.on("message", async message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "اظهار" || command == "unhide") {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(
        new Discord.MessageEmbed()
          .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
      if (!message.channel.guild) return;
      const role = message.guild.roles.cache.find(role => role.name === '@everyone')
      message.channel.updateOverwrite(role, { 'VIEW_CHANNEL': true })
      message.lineReply(new Discord.MessageEmbed()
        .setDescription(`** تم اظهار الروم <#${message.channel.id}> 🔓**`)
        .setColor('GREEN'))
    }
  });


  // Warn And Unwarn
  bot.on("message", async message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "تحذير" || command == "warn") {
      if (!message.channel.guild) return message.reply('**هذا الأمر للسيرفرات فقط**').then(ms => ms.delete(3000));
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return
      var member = message.mentions.users.first() || bot.users.cache.getget(message.content.split(' ')[1]);
      var user = message.guild.member(member);
      //var user = message.mentions.members.first()
      if (!user) return message.reply(`منشن شخص`)
      let warnlog = message.guild.channels.cache.find(ch => ch.id === '943567107906482306')
      var warnmsg = message.content.split(" ").slice(2).join(" ").trim()
      if (!warnmsg) return message.reply(new Discord.MessageEmbed()
        .setTitle(`Error 404`)
        .setDescription("** اكتب السبب - لازم تكتب سبب وجية **")
        .setColor('#700000'))
  
      let data = db.fetch(`warns_${message.guild.id}_${user.id}`)
      if (data === null) {
        await db.set(`warns_${message.guild.id}_${user.id}`, [`${warnmsg}`])
      } else {
        await db.push(`warns_${message.guild.id}_${user.id}`, `${warnmsg}`)
      }
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(`Completed`)
          .setColor("RED")
          .setDescription(`** ${message.member.displayName} - ${user} تم التحذير **`))
      let embed = new Discord.MessageEmbed()
        .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
        .setColor("RED")
        .setDescription(`** تم تحذيرك السبب : ${warnmsg}**`)
        .setFooter(message.guild.name, message.guild.iconURL())
      user.send(embed).catch(err => messsage.channel.send(`\`\`\`Error\n${err}\`\`\``))
  
      warnlog.send(new Discord.MessageEmbed()
        .setTitle(`Member Warn`)
        .addField(' \`\`\`اسم الشخص المطلوب:\`\`\`', ` **${user} ** `, true)
        .addField(' \`\`\`طلب بواسطة:\`\`\`', ` **${message.author.tag}** `, true)
        .addField(' \`\`\`السبب:\`\`\`', ` **${warnmsg}** `, true)
        .addField(' \`\`\`حسابه انشأ :\`\`\`', `** .       .${message.author.createdAt}**`, true)
        .setImage(`https://cdn.discordapp.com/attachments/873152845015293952/885525653754097664/WarnFace.png`)
        .setColor('#700000'))
  
    }
  })
  
  bot.on("message", message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "حذف-تحذير" || command == "removewarn") {    
     if (!message.channel.guild) return message.reply('**هذا الأمر للسيرفرات فقط**').then(ms => ms.delete(3000));
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return
      //var user = message.mentions.members.first()
      var member = message.mentions.users.first() || bot.users.cache.get(message.content.split(' ')[1]);
      var user = message.guild.member(member);
      if (!user) return message.reply(`منشن شخص`)
      db.delete(`warns_${message.guild.id}_${user.id}`)
      message.channel.send("تم نزع التحذيرات")
    }
  })
  
  bot.on("message", message => {
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "التحذيرات" || command == "showwarns") {      if (!message.channel.guild) return message.reply('**هذا الأمر للسيرفرات فقط**').then(ms => ms.delete(3000));
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return
      //var user = message.mentions.members.first()
      var member = message.mentions.users.first() || bot.users.cache.get(message.content.split(' ')[1]);
      var user = message.guild.member(member);
      if (!user) return message.reply(`منشن شخص`)
      let data = db.get(`warns_${message.guild.id}_${user.id}`)
      if (data === null) {
        return message.reply("لا توجد اي تحذيرات")
      }
  
      let counter = 1
      let warns = data.map(d => `\`${counter++}-${d}\`\n\n`)
  
      let embed = new Discord.MessageEmbed()
        .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true })).setDescription(`${warns}`)
      message.channel.send(embed)
    }
  })

  // Mute And Unmute 
  bot.on("message", (message) => {
    try {
      if (!message.guild) {
        return;
      } else if (message.author.bot) {
        return;
      }
      let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "mute" || command == "ميوت") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(
          new Discord.MessageEmbed()
            .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
        let muteRole = "945322384855007292"; //تعديل مهم ، حط أيدي الميوت رول
        //let targetedMember = message.mentions.members.first();
        var member = message.mentions.users.first() || bot.users.cache.get(message.content.split(' ')[1]);
        var targetedMember = message.guild.member(member);
        let mutelog = message.guild.channels.cache.find(ch => ch.id === '943567107906482306')
        var mutemsg = message.content.split(" ").slice(2).join(" ").trim()
        if (!mutemsg) return message.reply(new Discord.MessageEmbed()
          .setTitle(`Error 404`)
          .setDescription("** اكتب السبب - لازم تكتب سبب وجية **")
          .setColor('#700000'))
  
        if (targetedMember.roles.cache.has(muteRole)) {
          message.lineReply(new Discord.MessageEmbed()
            .setTitle(`Error 404`)
            .setDescription("**هذا الشخص قد أخذ ميوت كتابي من قبل **")
            .setColor('RED'))
        } else if (!targetedMember.roles.cache.has(muteRole)) {
          targetedMember.roles
            .add(muteRole)
            .then(() => {
              message.lineReply(new Discord.MessageEmbed()
                .setTitle(`Completed`)
                .setDescription(`**${message.member.displayName} - ${targetedMember} تم اعطائة ميوت.**`)
                .setColor('#105200'))
            })
          mutelog.send(new Discord.MessageEmbed()
            .setTitle(`Member Mute`)
            .addField(' \`\`\`اسم الشخص المطلوب:\`\`\`', ` **${targetedMember} ** `, true)
            .addField(' \`\`\`طلب بواسطة:\`\`\`', ` **${message.author.tag}** `, true)
            .addField(' \`\`\`السبب:\`\`\`', ` **${mutemsg}** `, true)
            .addField(' \`\`\`حسابه انشأ :\`\`\`', `** .       .${message.author.createdAt}**`, true)
            .setImage(`https://cdn.discordapp.com/attachments/873152845015293952/885498139908399125/MuteFace.png`)
            .setColor('#700000'))
  
          let embed = new Discord.MessageEmbed()
            .setAuthor(targetedMember.user.username, targetedMember.user.displayAvatarURL({ dynamic: true }))
            .setColor("#700000")
            .setDescription(`** تم اعطائك ميوت السبب : ${mutemsg}**`)
            .setFooter(message.guild.name, message.guild.iconURL())
          targetedMember.send(embed).catch(err => messsage.channel.send(`\`\`\`Error\n${err}\`\`\``))
  
            .then(() => {
              message.guild.channels.cache.forEach((ch) => {
                ch.updateOverwrite(muteRole, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false,
                });
              });
            });
        }
      } else if (message.content.startsWith(prefix + "unmute") || message.content.startsWith(prefix + "فك-الميوت")) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(
          new Discord.MessageEmbed()
            .setTitle(`Error 404`)
            .setDescription(`** غير مسموح لك استعمال هذا الامر <@${message.author.id}> **`))
  
        //let targetedMember = message.mentions.members.first();
        var member = message.mentions.users.first() || bot.users.cache.get(message.content.split(' ')[1]);
        var targetedMember = message.guild.member(member);
        let unmutelog = message.guild.channels.cache.find(ch => ch.id === '943568349521117204')
        let muteRole = "945322384855007292";
        var unmutemsg = message.content.split(" ").slice(2).join(" ").trim()
        if (!unmutemsg) return message.reply(new Discord.MessageEmbed()
          .setTitle(`Error 404`)
          .setDescription("** اكتب السبب - لازم تكتب سبب وجية **")
          .setColor('#700000'))
  
        if (!targetedMember.roles.cache.has(muteRole)) {
          return message.lineReply(new Discord.MessageEmbed()
            .setTitle(`Error 404`)
            .setDescription("**هذا الشخص ليس لدية ميوت.**")
            .setColor('RED'))
        } else {
          targetedMember.roles.remove(muteRole).then(() => {
            message.lineReply(new Discord.MessageEmbed()
              .setTitle(`Completed`)
              .setDescription(`**${message.member.displayName}- ${targetedMember} تم فك الميوت.**`)
              .setColor('GREEN'))
  
            unmutelog.send(new Discord.MessageEmbed()
              .setTitle(`Member UnMute`)
              .addField(' \`\`\`اسم الشخص المطلوب:\`\`\`', ` **${targetedMember} ** `, true)
              .addField(' \`\`\`طلب بواسطة:\`\`\`', ` **${message.author.tag}** `, true)
              .addField(' \`\`\`السبب:\`\`\`', ` **${unmutemsg}** `, true)
              .addField(' \`\`\`حسابه انشأ :\`\`\`', `** .       .${message.author.createdAt}**`, true)
              .setImage(`https://cdn.discordapp.com/attachments/873152845015293952/885560470008893460/Sprite-0001.png`))
          });
        }
      }
    } catch {
      /**/
    }
  });


  // Welcome 
  bot.on('guildMemberAdd', (member) => {
    var channelID = 943563793152229476; // شيل ال صفر و حط ال اي دي روم الترحيب
    var channel = member.guild.channels.cache.find(channel => channel.id == channelID)
    channel.send(
      new Discord.MessageEmbed()
        .setColor('#ffffff')
        .setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }))
        .addField(' \`\`\`ارررررحببب :\`\`\`', ` **<@${member.user.id}>** `, true)
        .addField(' \`\`\`رقمك في السيرفر :\`\`\`', ` **${member.guild.memberCount}** `, true)
        .addField(' \`\`\`القوانين :\`\`\`', ` **<#767094209618247720>** `, true)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setImage(`https://cdn.discordapp.com/attachments/873152845015293952/886162004207882280/Sprite-0001.png`)
    )
  });


  // Suggest
  bot.on('message', message => {
    if (message.channel.id != '945279859037470750') return;
    if (message.member.user.bot) return;
    message.channel.send(new Discord.MessageEmbed()
      .setDescription(`** شكرآ لاقتراحك ونحن نعمل بجهد لجعل السيرفر افضل <@${message.author.id}> ❤️ **`)
      .setColor('BLACK'))
  });
  bot.on('message', msg => {
    let Salou7a = msg.content.split(" ").slice('').join(" ")
  
    var channel = msg.channel.id === '945279859037470750'
    if (!channel) return false;
    if (msg.member.hasPermission('MANAGE_GUILD')) return; //لو شخص معه ذا  اابرمشن البوت ماراح يحذف كلامه او يعتبره كاقتراح
    if (msg.author.bot) return;
    if (msg.content.startsWith('')) {
      msg.delete()
  
      var embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag)
        .setThumbnail(msg.author.avatarURL())
        .setColor('BLACK')//color
        .setDescription(`Suggest : ${Salou7a}`);
  
  
  
      bot.channels.cache.get("945279859037470750").send(embed).then(function(msg) {
        //ايدي روم الاقتراحات لو تبي حط نفس ايدي الروم اللي يكتبو فيه الاقتراحات احسنلك
        msg.react("👍")//حط رياكشن ثاني لو تبي
        msg.react("👎")//نفس الشي
      }).catch(function() {
  
      });
    }
  
  
  });


  // Invaite
  const channel_logger_id = require("./config.json").channel_id

  bot.on("inviteCreate", (invite) => {
    bot.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    })
  })
});
bot.on("inviteDelete", (invite) => {
  bot.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    })
  })
});
bot.on('guildMemberAdd', async member => {
  member.guild.fetchInvites().then(async guildInvites => {
      const ei = invites[member.guild.id];
      invites[member.guild.id] = guildInvites;
      const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses) || member.guild.vanityURLCode
      const inviter = bot.users.cache.get(invite.inviter.id);
      if(invite == member.guild.vanityURLCode) {
         description = `${member} joined with vanity code`
         footer = ""
      }
      if (invite.inviter) {
        await db.set(`${member.id}.inviter`, invite.inviter.id);
        let check_data = await db.get(`${invite.inviter.id}.join`)
        if (check_data == null) await db.set(`${invite.inviter.id}.join`, 0)
        let check_leave = await db.get(`${invite.inviter.id}.leave`)
        if (check_leave == null) await db.set(`${invite.inviter.id}.leave`, 0)
        let leave  = await db.get(`${invite.inviter.id}.leave`)
        let join = await db.get(`${invite.inviter.id}.join`)
        join+=1;
        db.set(`${invite.inviter.id}.join`, join)
        description = `
       **الشخص الي دخل <@${member.user.id}>
       الي دخل الشخص ${invite.inviter} **
       **كم دخل شخص**: ${join}
       **الي طلعو**: ${leave}
       **المجموع دخول و خروج** ${join-leave}
       `
       footer = `${member.user.tag} was invited by ${invite.inviter.tag}`
      }
      let channel = member.guild.channels.cache.find((ch) => ch.id === channel_logger_id);
      const LogEmbed = new Discord.MessageEmbed()
       .setColor("#00997a")
       .setAuthor(`ولللللللكمممم `,member.user.displayAvatarURL({dynamic: true}))
       .setDescription(description)
       .setTimestamp()
       .setFooter(footer)
       channel.send(LogEmbed)
       });
});
bot.on("message", async (message, args) => {
    if (message.author.bot) return
    let check_data = await db.get(`${message.author.id}.join`)
    if (check_data == null) await db.set(`${message.author.id}.join`, 0)
    let check_leave = await db.get(`${message.author.id}.leave`)
    if (check_leave == null) await db.set(`${message.author.id}.leave`, 0)
    let leave  = await db.get(`${message.author.id}.leave`)
    let join = await db.get(`${message.author.id}.join`)
    if (message.content.replace(/ /g, '').toLowerCase().startsWith(prefix + "دعواتي")) {
       const Embed = new Discord.MessageEmbed()
       .setColor("#00997a")
       .setAuthor(message.author.tag,message.author.displayAvatarURL({dynamic: true}))
       .setDescription(`**عدد دعوتك هو**: ${join-leave}`)
       .setTimestamp()
       message.channel.send(Embed)
    }
})


// التقديم الاداري
let roomid = "945350678778376254";
bot.on("message", message => {
  if (message.content.startsWith(prefix + "admin")) {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
    let channel = bot.channels.cache.get(roomid);
    if (channel) {
      message.lineReply(new Discord.MessageEmbed()
        .setDescription(`**يرجى الالتزام بالاسئلة**`)
        .setColor('#470708'))
        .then((m) => {
          m.edit(new Discord.MessageEmbed()
            .setDescription(`**<@${message.author.id}> كم عمرك ؟**`)
            .setColor('#07472a'))
          m.channel.awaitMessages(m1 => m1.author == message.author, { max: 1, time: 60 * 1000 }).then((m1) => {
            m1 = m1.first();
            var name = m1.content;
            m1.delete();
            m.edit(new Discord.MessageEmbed()
              .setDescription(`**Loading | جاري التحميل**`)
              .setColor('#470708'))
              .then((m) => {
                m.edit(new Discord.MessageEmbed()
                  .setDescription(`**<@${message.author.id}> ما هي الخبرة لديك في مجال خدمة العملاء ؟**`)
                  .setColor('#07472a'))
                setTimeout(() => {
                  m.delete()
                }, 10000);
                m.channel.awaitMessages(m2 => m2.author == message.author, { max: 1, time: 60 * 1000 }).then((m2) => {
                  m2 = m2.first();
                  var age = m2.content;
                  m2.delete()
                  message.lineReply(new Discord.MessageEmbed()
                    .setDescription(`**Loading | جاري التحميل **`)
                    .setColor('#470708'))
                    .then((m) => {
                      m.edit(new Discord.MessageEmbed()
                        .setDescription(`***<@${message.author.id}>  ماهي اختصاصاتك و كيف يمكن ان تساعدنا بها ؟**`)
                        .setColor('#07472a'))
                      setTimeout(() => {
                        m.delete()
                      }, 10000);
                      m.channel.awaitMessages(m1 => m1.author == message.author, { max: 1, time: 60 * 1000 }).then((m3) => {
                        m3 = m3.first();
                        var ask = m3.content;
                        m3.delete();
                        message.lineReply(new Discord.MessageEmbed()
                          .setDescription(`**Loading | جاري التحميل **`)
                          .setColor('#470708'))
                          .then((m) => {
                            m.edit(new Discord.MessageEmbed()
                              .setDescription(`***<@${message.author.id}>  هل استخدمت قبل (هاكات) واذا نعم ، أي واحدة ؟**`)
                              .setColor('#07472a'))
                            setTimeout(() => {
                              m.delete()
                            }, 10000);
                            m.channel.awaitMessages(m1 => m1.author == message.author, { max: 1, time: 60 * 1000 }).then((m4) => {
                              m4 = m4.first();
                              var ask2 = m4.content;
                              m4.delete();
                              message.lineReply(new Discord.MessageEmbed()
                                .setDescription(`**Loading | جاري التحميل **`)
                                .setColor('#470708'))
                                .then((m) => {
                                  m.edit(new Discord.MessageEmbed()
                                    .setDescription(`***<@${message.author.id}> هل تظن إنك مسؤول كفايةً لتحمل واجبات المتطلبة لهذه الوظيفة و ما السبب؟ **`)
                                    .setColor('#07472a'))
                                  m.channel.awaitMessages(m1 => m1.author == message.author, { max: 1, time: 60 * 1000 }).then((m5) => {
                                    m5 = m5.first();
                                    var ask3 = m5.content;
                                    m5.delete();
                                    m.edit(new Discord.MessageEmbed()
                                      .setDescription(`** *<@${message.author.id}> تم ارسال تقديمك سيتم الرد عليك قريبا **`)
                                      .setColor('#470708'))
                                      .then((mtime) => {
                                        setTimeout(() => {
                                          let embed = new Discord.MessageEmbed()
                                            .setAuthor(message.author.username, message.author.avatarURL())
                                            .setColor('#c3cdff')
                                            .setTitle(`\`Apply Administartion\` \n سوف يتم الرد عليك قريبا من الادارة , \n > ID: <@${message.author.id}>`)
                                            .addField('> \`عمرك:\`', ` ** ${name} ** `, true)
                                            .addField('> \`الخبرة في مجال خدمة العملاء:\`', ` ** ${age} ** `, true)
                                            .addField('> \`اختصاصاتة:\`', `** ${ask} ** `, true)
                                            .addField('> \`هل له علاقة بالهاكات:\` ', ` ** ${ask2} ** `, true)
                                            .addField('> \`هل هو مسؤول: ?\`', ` ** ${ask3} ** `, true)
                                            .addField('> حسابك انشأ :', ` \`${message.author.createdAt} \` `, true)
                                          channel.send(embed)
                                        }, 2500);
                                        setTimeout(() => {
                                          mtime.delete()
                                        }, 3000);

                                      })
                                  })
                                })
                            })
                          })
                      })
                    })
                })
              })
          })
        })
    }
  }
});

