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
import messageCommand from './commands/commands.js'
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
    let prefix = await global.guildcache.get("prefix", message.guildId);
    if (
      message.author.bot | !(message.content.slice(0, prefix.length) == prefix)
    ) return;

    const {command, query, args} = helpers.processQuery(message.content, prefix)

    console.log(
      `\nMessage from ${message.author.username}: ${message.content}`
    );
    console.log(`args ${args} | command ${command} | query ${query}\n`);

    messageCommand.messageEvent(message, command, query, args, ytsearch)

  });
}

export default { events };
