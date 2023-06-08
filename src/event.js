import {
  Events,
} from 'discord.js';

function eventsClient(client){

  function processQuery(item){
    let args    = item.trim().split(/ +/g);
    let command = args.shift();
    let query   = args.join(' ');
    return [command,query]
  }

  function configSwith(query, message){
    let x = processQuery(query)
    switch (x[0]) {
      case 'prefix':
        if(x[1].length < 12){
          global.guildcache.set("prefix", message.guildId, x[1])
          message.reply(`new prefix - |${x[1]}|`)
          return
        }
        message.reply("prefix too big, try again")
        break;
      case 'channelSongs':
        let channel = message.guild.channels.resolveId(x[1])
        if (channel) {
          global.guildcache.set("channelSongs", message.guildId, channel)
          message.channel.send(`Song out Channel set: ${channel}`);
        } else {
          message.channel.send('Invalid Channel!');
        }
        break;
      default:
        message.reply(`Not a valid command ${command}`)
        break;
    }
  }

  client.once(Events.ClientReady, async() => {
    console.log(`Logged in as ${client.user.tag}!`);
    const Guilds = client.guilds.cache.map(guild => guild);
    Guilds.forEach(element => {
      console.log(`id: ${element.id} name: ${element.name}`);
    });
  });

  client.on(Events.MessageCreate, async (message) => {
    let prefix = await global.guildcache.get("prefix", message.guildId)
    if (message.author.bot | !(message.content.slice(0,prefix.length) == prefix)) return;
  
    const args    = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    const query   = args.join(' ');
  
    console.log(`\nMessage from ${message.author.username}: ${message.content}`);
    console.log(`\nargs ${args} | command ${command} | query ${query}\n`);
    
    switch (command) {
      case 'config':
        configSwith(query,message)
        break;
      default:
        message.reply(`Not a valid command ${command}`)
    }
  });

}

export default { eventsClient };