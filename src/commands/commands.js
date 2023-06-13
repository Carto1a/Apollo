import helpers from "../helpers/helpers.js";
import config from "./config.js"
import embed from "./embed.js";
import {
  getVoiceConnection
} from "@discordjs/voice";
import { PermissionsBitField } from "discord.js";

async function messageEvent(message, command, query, args, ytsearch){
  let queue;
  let current;
  let player;

  switch (command) {
    case 'embed':
      embed.commandSwith(query, message);
      break;
    case "config":
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        message.reply("need Administrator permissions")
        return
      }
      config.commandSwith(query, message);
      break;
    case "join":
      helpers.connectToChannel(message);
      break;
    case "play":
      getVoiceConnection(message.guildId)
        ? false
        : helpers.connectToChannel(message);
      ytsearch.send([query, message]);
      break;
    case "skip":
      global.guildcache.setmeta(
        "current",
        message.guildId,
        global.guildcache.getmeta("current", message.guildId) + 1
      );
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
    case "queue":
      queue = global.guildcache.getmeta("queue", message.guildId);
      message.reply("dsad" + queue);
      console.log(queue);
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
      let connection = global.guildcache.getmeta(
        "connection",
        message.guildId
      );
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
        global.guildcache.getmeta("current", message.guildId) - 1
      );
      helpers.playQueue(message);
      break;
    case "remove":
      console.log("nao feito");
      break;
    case "kill":
      message.reply("tchau")
      process.exit()
      break;
    case "ping":
      console.log("nao feito");
      break;
    case "emoji":
      console.log("nao feito");
      break;
    default:
      message.reply(`Not a valid command ${command}`);
  }
}

export default { messageEvent }