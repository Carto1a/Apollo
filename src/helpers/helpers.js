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
import ytdl from "ytdl-core";

function processQuery(item, slice) {
  let args = item.slice(slice.length).trim().split(/ +/g);
  let command = args.shift();
  let query = args.join(" ");
  return {command, query, args};
}

function connectToChannel(message) {
  const voiceChannel = message.member.voice.channel;
  const voiceConnection = getVoiceConnection(message.guildId);

  if (!voiceChannel)
    return message.reply(
      "Você precisa estar em um canal de voz para usar esse comando."
    );

  if (voiceConnection) {
    message.reply("O bot ja esta conectado em um canal de voz");
    return voiceConnection;
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });

  global.guildcache.setmeta("player", message.guildId, player);
  global.guildcache.setmeta("connection", message.guildId, connection);
  global.guildcache.setmeta(
    "subscribe",
    message.guildId,
    connection.subscribe(player)
  );

  player.on(AudioPlayerStatus.Playing, () => {
    console.log("Conexão estabelecida.");
  });

  player.on(AudioPlayerStatus.Idle, () => {
    let guildId = message.guildId;
    let queue
    let current
    global.guildcache.setmeta("playing", message.guildId, false);
    console.log("Esperando.");
    queue = global.guildcache.getmeta("queue", guildId);
    // rescrever
    current = global.guildcache.getmeta("current", guildId);
    global.guildcache.setmeta(
      "current",
      message.guildId,
      global.guildcache.getmeta("current", message.guildId) + 1
    );
    if (current == queue.length - 1) {
      return;
    }
    playQueue(guildId);
    global.guildcache.setmeta("playing", message.guildId, true);
  });

  player.on(AudioPlayerStatus.Buffering, () => {
    console.log("Buffering");
  });

  player.on("error", (error) => {
    console.error(
      `ERROR: message => ${error.message}: cause => ${error.stack}`
    );
  });

  connection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log("Disconnected");
  });

  connection.on(VoiceConnectionStatus.Signalling, () => {
    console.log("Signalling");
  });

  connection.on(VoiceConnectionStatus.Connecting, () => {
    console.log("Connecting");
  });

  connection.on("error", (error) => {
    console.error(
      `ERROR: message => ${error.message}: cause => ${error.stack}`
    );
  });

  connection.on("stateChange", (old_state, new_state) => {
    console.log(`old: ${old_state.status} new: ${new_state.status}`);

    const oldNetworking = Reflect.get(old_state, "networking");
    const newNetworking = Reflect.get(new_state, "networking");

    const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
      const newUdp = Reflect.get(newNetworkState, "udp");
      clearInterval(newUdp?.keepAliveInterval);
    };

    oldNetworking?.off("stateChange", networkStateChangeHandler);
    newNetworking?.on("stateChange", networkStateChangeHandler);
  });

  try {
    entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

async function play(track, player) {
  if (!track) track = "./song0.m4a";
  const stream = ytdl(track, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 25,
    filter: (format) => format.container === "webm",
  });
  let resource = createAudioResource(stream, {
    inputType: StreamType.WebmOpus,
  });
  player.play(resource);
}

async function playQueue(guildId) {
  let player = guildcache.getmeta("player", guildId);
  let queue = global.guildcache.getmeta("queue", guildId);
  let current = global.guildcache.getmeta("current", guildId);
  let videoId = queue[current].id.videoId;
  let url = `https://www.youtube.com/watch?v=${videoId}`;

  await play(url, player, guildId);
}

export default {
  connectToChannel,
  processQuery,
  playQueue,
};
