const Discord = require('discord.js');
const client = new Discord.Client();
const { GuildChannelManager } = require('discord.js');
const { Client } = require('discord.js');
const cron = require('node-cron');

const emoji = '❤️';

// Remplacez "TOKEN" par votre token de bot
client.login('TOKEN');

// tableau pour stocker tous les likes
let likes = [];

// tableau pour stocker le nombre de likes envoyés par chaque utilisateur
let dailyLikes = {};

// tâche cron pour réinitialiser le compteur de likes par jour chaque jour à minuit
cron.schedule('0 0 * * *', () => {
  dailyLikes = {};
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Vie Robitique", {type: "PLAYING"});
  });

  

client.on('message', message => {
  // Si le message commence par "!like"
  if (message.content.startsWith('!like')) {
    // Récupérez l'utilisateur mentionné
    const user = message.mentions.users.first();
    // Si l'utilisateur n'a pas été mentionné ou s'il s'agit du bot lui-même, ignorez le message
    if (!user || user.id === client.user.id) return;


    // Vérifiez si l'utilisateur a déjà été liké par la personne qui a envoyé le message
    if (likes.includes(`${user.id}-${message.author.id}`)) {
      // Si oui, créez un channel privé et envoyez un message à l'utilisateur
      console.log(`\x1b[32m[LIKE]`, `${message.author.username} a Liké ${user.username}`)
        // incrémente le compteur de likes de l'utilisateur qui a envoyé le message
        if (dailyLikes[message.author.id]) {
            dailyLikes[message.author.id]++;
          } else {
            dailyLikes[message.author.id] = 1;
          }
        
        // Vérifiez si l'utilisateur a le rôle 1058530153715732520
        if (message.member.roles.cache.has('1058530153715732520')) {
          // Si oui, accordez-lui 25 likes par jour au lieu de 15
          if (dailyLikes[message.author.id] >= 25) {
            message.channel.send(`${message.author}, vous avez atteint votre limite de 25 likes pour la journée. Veuillez réessayer demain.`);
            console.log(`\x1b[31m[LIKE]`, `${message.author.username} n'a plus de like`)
            return;
          }
        } else {
          // Si l'utilisateur n'a pas le rôle, accordez-lui 15 likes par jour
          if (dailyLikes[message.author.id] >= 15) {
            message.channel.send(`${message.author}, vous avez atteint votre limite de 15 likes pour la journée. Veuillez réessayer demain.`);
            console.log(`\x1b[31m[LIKE]`, `${message.author.username} n'a plus de like`)
            return;
          }
        
        
    }
      message.guild.channels.create(`${message.author.username}-${user.username}`, {
        type: 'text',
        parent: '1058877664712216638', // Remplacez "CATEGORY_ID" par l'ID de la catégorie souhaitée
        permissionOverwrites: [
          {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL']
          },
          {
            id: message.author.id,
            allow: ['VIEW_CHANNEL']
          },
          {
            id: user.id,
            allow: ['VIEW_CHANNEL']
          },
          {
            id: '1058530141854257312', // Remplacez "ROLE_ID" par l'ID du rôle souhaité
            allow: ['VIEW_CHANNEL']
          }
        ]
      }).then(channel => {
        channel.send(`${user}, vous avez été liké par ${message.author} ! Vous pouvez maintenant discuter en privé.`);
        user.send(`Vous avez un match avec ${message.author} , un channel a était créér ! `)
        console.log(`[MATCH] ${user} a eu un Match !`)
      });
    } else {
      // Sinon, ajoutez le like au tableau et ajoutez une réaction au message
      likes.push(`${message.author.id}-${user.id}`);
        
      // incrémente le compteur de likes de l'utilisateur qui a envoyé le message
        if (dailyLikes[message.author.id]) {
            dailyLikes[message.author.id]++;
          } else {
            dailyLikes[message.author.id] = 1;
          }
    
        // Vérifiez si l'utilisateur a le rôle 1058530153715732520
        if (message.member.roles.cache.has('1058530153715732520')) {
          // Si oui, accordez-lui 25 likes par jour au lieu de 15
          if (dailyLikes[message.author.id] >= 25) {
            message.channel.send(`${message.author}, vous avez atteint votre limite de 25 likes pour la journée. Veuillez réessayer demain.`);
            console.log(`[LIKE] ${message.author.username} n'a plus de like`)
            return;
          }
        } else {
          // Si l'utilisateur n'a pas le rôle, accordez-lui 15 likes par jour
          if (dailyLikes[message.author.id] >= 15) {
            message.channel.send(`${message.author}, vous avez atteint votre limite de 15 likes pour la journée. Veuillez réessayer demain.`);
            console.log(`${message.author.username} n'a plus de like`)
            return;
          }
        }
      user.send('Vous avez reçu un like !')
      message.react(emoji);
      console.log(`\x1b[32m[LIKE]`, `${message.author.username} a Liké ${user.username}`)
    }
  }
});

// Chaque jour à minuit, réinitialisez les likes
const resetLikes = () => {
    dailyLikes = [];
};

setInterval(resetLikes, 86400000); // 86400000 milliseconds = 24 heures
