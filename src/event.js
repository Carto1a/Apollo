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
  joinVoiceChannel,
} from "@discordjs/voice";
import { fork } from "child_process";
const controller = new AbortController();
const { signal } = controller;

function events(client) {
  const ytsearch = fork("./src/workers/ytsearch.js", [], { signal });

  ytsearch.on("error", (err) => {
    console.log(err);
  });

  ytsearch.on("message", function (message) {
    let queue = global.guildcache.getmeta("queue", message[1]);
    queue.push(message[0]);
    // global.guildcache.setmeta("queue", message[1], queue);
    let playing = global.guildcache.getmeta("playing", message[1]);
    playing ? true : helpers.playQueue(message[1]);
    global.guildcache.setmeta("playing", message[1], true);
    // controller.abort();
  });

  ytsearch.on("close", function (code) {
    console.log("child process exited with code " + code);
  });

  client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const Guilds = client.guilds.cache.map((guild) => guild);
    Guilds.forEach((element) => {
      console.log(`id: ${element.id} name: ${element.name}`);
    });
  });

  client.on(Events.MessageCreate, async (message) => {
    let queue;
    let current;
    let player;
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
        helpers.connectToChannel(message);
        break;
      case "play":
        getVoiceConnection(message.guildId)
          ? false
          : helpers.connectToChannel(message);
        ytsearch.send([query, message.guildId]);
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
        console.log("nao feito");
        break;
      case "ping":
        console.log("nao feito");
        break;
      default:
        message.reply(`Not a valid command ${command}`);
    }
  });
}

export default { events };
