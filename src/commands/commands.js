import helpers from "../helpers/helpers.js";
import config from "./config.js";
import embed from "../embeds/embeds.js";
import { getVoiceConnection } from "@discordjs/voice";
import { PermissionsBitField } from "discord.js";
import trackSearch from "../searchSongs/index.js";

async function messageEvent(message, command, query, args) {
  let player;
  let queue;
  let current;

  switch (command) {
    case "config":
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        message.reply("need Administrator permissions");
        return;
      }
      config.commandSwith(query, message);
      break;
    case "join":
      helpers.connectToChannel(message);
      break;
    case "play":
      getVoiceConnection(message.guildId) ? false : helpers.connectToChannel(message);
      trackSearch.search({ query, message, args });
      break;
    case "skip":
      let skip;
      skip = args[0] == undefined ? 1 : parseInt(args[0]);
      if (skip == NaN) {
        message.reply(`Argumento Invalito ${args[0]}`);
        return;
      }
      current = global.guildcache.getmeta("current", message.guildId);
      queue = global.guildcache.getmeta("queue", message.guildId);
      skip = skip >= queue.length ? queue.length - (current - 1) - 2 : skip;
      global.guildcache.setmeta("current", message.guildId, current + skip);
      message.reply({ embeds: [embed.skip(skip)] });
      helpers.playQueue(message.guildId);
      break;
    case "pause":
      player = global.guildcache.getmeta("player", message.guildId);
      player.pause();
      break;
    case "resume":
      player = global.guildcache.getmeta("player", message.guildId);
      player.unpause();
      break;
    case "stop":
      console.log("stop");
      break;
    case "queue":
      message.guildName = message.guild.name;
      message.guildImgURL = message.guild.iconURL();
      message.reply({ embeds: [await embed.queue(message)] });
      break;
    case "clearqueue":
      queue = global.guildcache.getmeta("queue", message.guildId);
      current = global.guildcache.getmeta("current", message.guildId);
      global.guildcache.setmeta("queue", message.guildId, [queue[current]]);
      global.guildcache.setmeta("current", message.guildId, 0);
      break;
    case "leave":
      queue = global.guildcache.getmeta("queue", message.guildId);
      current = global.guildcache.getmeta("current", message.guildId);
      global.guildcache.setmeta("queue", message.guildId, [queue[current]]);
      global.guildcache.setmeta("current", message.guildId, 0);
      let connection = global.guildcache.getmeta("connection", message.guildId);
      connection.destroy();
      break;
    case "loop":
      console.log("nao feito");
      break;
    case "playing":
      queue = global.guildcache.getmeta("queue", message.guildId);
      current = global.guildcache.getmeta("current", message.guildId);
      message.reply(queue[current].snippet.title);
      break;
    case "voltar":
      global.guildcache.setmeta(
        "current",
        message.guildId,
        global.guildcache.getmeta("current", message.guildId) - 1,
      );
      helpers.playQueue(message);
      break;
    case "remove":
      console.log("nao feito");
      break;
    case "kill":
      message.reply("tchau");
      process.exit();
      break;
    case "ping":
      console.log("nao feito");
      break;
    case "emoji":
      console.log("nao feito");
      break;
    case "dump":
      global.guildcache.dump();
      break;
    default:
      message.reply(`Not a valid command ${command}`);
  }
}

export default { messageEvent };
