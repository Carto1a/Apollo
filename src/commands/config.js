import helpers from "../helpers/helpers.js";

function configSwith(query0, message) {
  const {command, query, args} = helpers.processQuery(query0, "");
  switch (command) {
    case "prefix":
      if (query.length < 12) {
        global.guildcache.set("prefix", message.guildId, query);
        message.reply(`new prefix - |${query}|`);
        return;
      }
      message.reply("prefix too big, try again");
      break;
    case "channelSongs":
      let channel = message.guild.channels.resolveId(query);
      if (channel) {
        global.guildcache.set("channelSongs", message.guildId, channel);
        message.channel.send(`Song out Channel set: ${channel}`);
      } else {
        message.channel.send("Invalid Channel!");
      }
      break;
    default:
      message.reply(`Not a valid command ${command}`);
      break;
  }
}

export default { configSwith }