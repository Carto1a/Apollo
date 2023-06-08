import { Events } from "discord.js";
import helpers from "./helpers/helpers.js";
import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel
} from '@discordjs/voice';

function eventsClient(client, player) {

  client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const Guilds = client.guilds.cache.map((guild) => guild);
    Guilds.forEach((element) => {
      console.log(`id: ${element.id} name: ${element.name}`);
    });
  });

  client.on(Events.MessageCreate, async (message) => {
    let prefix = await global.guildcache.get("prefix", message.guildId);
    if (
      message.author.bot | !(message.content.slice(0, prefix.length) == prefix)
    )
      return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    const query = args.join(" ");

    console.log(
      `\nMessage from ${message.author.username}: ${message.content}`
    );
    console.log(`args ${args} | command ${command} | query ${query}\n`);

    switch (command) {
      case "config":
        configSwith(query, message);
        break;
      case "join":
        helpers.connectToChannel(message, player);
        break;
      case "play":
        getVoiceConnection(message.guildId)? false:helpers.connectToChannel(message, player);
        await helpers.getTypeQuery(query, message);
        let playing = global.guildcache.getmeta("playing", message.guildId)
        playing? true:helpers.playQueue(player, message);
        global.guildcache.setmeta("playing", message.guildId, true)
        break;
      case "skip":
        global.guildcache.setmeta("current", message.guildId, global.guildcache.getmeta("current", message.guildId) +1)
        helpers.playQueue(player, message);
        break;
      case "pause":
        player.pause();
        break;
      case "resume":
        console.log("nao feito")
        break;
      case "queue":
        console.log("nao feito")
        break;
      case "clearqueue":
        console.log("nao feito")
        break;
      case "leave":
        console.log("nao feito")
        break;
      case "loop":
        console.log("nao feito")
        break;
      case "playing":
        console.log("nao feito")
        break;
      case "voltar":
        console.log("nao feito")
        break;
      case "remove":
        console.log("nao feito")
        break;
      case "kill":
        console.log("nao feito")
        break;
      case "ping":
        console.log("nao feito")
        break;
      default:
        message.reply(`Not a valid command ${command}`);
    }
  });
}

export default { eventsClient };