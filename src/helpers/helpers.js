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
import ytdl from 'ytdl-core';

// funcao de matar
// funcao de playlist
// funcao de loop
// funcao de force play

const youtubeSongRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g;

function processQuery(item) {
  let args = item.trim().split(/ +/g);
  let command = args.shift();
  let query = args.join(" ");
  return [command, query];
}

function configSwith(query, message) {
  let x = processQuery(query);
  switch (x[0]) {
    case "prefix":
      if (x[1].length < 12) {
        global.guildcache.set("prefix", message.guildId, x[1]);
        message.reply(`new prefix - |${x[1]}|`);
        return;
      }
      message.reply("prefix too big, try again");
      break;
    case "channelSongs":
      let channel = message.guild.channels.resolveId(x[1]);
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

function connectToChannel(message, player) {

  const voiceChannel    = message.member.voice.channel;
  const voiceConnection = getVoiceConnection(message.guildId);

  if (!voiceChannel)
    return message.reply(
      "Você precisa estar em um canal de voz para usar esse comando."
    );

  if (voiceConnection){
    message.reply(
      "O bot ja esta conectado em um canal e voz"
    )
    return voiceConnection;
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  global.guildcache.setmeta("subscribe", message.guildId, connection.subscribe(player))

  connection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log("Disconnected");
  });

  connection.on(VoiceConnectionStatus.Signalling, () => {
    console.log("Signalling");
  });

  connection.on(VoiceConnectionStatus.Connecting, () => {
    console.log("Connecting");
  })

  connection.on('stateChange', (old_state, new_state) => {
    console.log(`old: ${old_state.status} new: ${new_state.status}`);

    const oldNetworking = Reflect.get(old_state, 'networking');
    const newNetworking = Reflect.get(new_state, 'networking');

    const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
      const newUdp = Reflect.get(newNetworkState, 'udp');
      clearInterval(newUdp?.keepAliveInterval);
    }

    oldNetworking?.off('stateChange', networkStateChangeHandler);
    newNetworking?.on('stateChange', networkStateChangeHandler);
  })

  try {
    entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error
  }
}

async function searchTracksByQuery(query, message){
  const apikey    = process.env.YOUTUBE_KEY;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&fields=items(id(videoId),snippet(title))&q=${encodeURIComponent(query)}&key=${apikey}`;

  let track;

  await fetch(searchUrl)
    .then(res => res.json())
    .then(async json => {
      
      const videoId = json.items[0].id.videoId;
      const url     = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apikey}&fields=items(contentDetails(duration))`;

      await fetch(url)
        .then(res => res.json())
        .then(video => {
          json.items[0].duration = video.items[0].contentDetails.duration;
          track = json.items[0];

          console.log(`Title: ${json.items[0].snippet.title} id: ${json.items[0].id.videoId} duracao: ${json.items[0].duration}`);
        })

      console.log(`https://www.youtube.com/watch?v=${videoId}`);
      let queue = global.guildcache.getmeta("queue", message.guildId)
      queue.push(track);
    }).catch(err => console.log(err));
}

async function searchTracksByURL(urlTrack, message){

  // const apikey    = process.env.YOUTUBE_KEY;
  // let track;
  // const idRegex = /([A-Za-z0-9]+(_[A-Za-z0-9]+)+)|(?:[=])([A-Za-z0-9]+\3)/g;

  // // const videoId = urlTrack.match(idRegex);
  // const videoId = urlTrack.replace(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)/, "");
  // const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apikey}&fields=items(contentDetails(duration))`;

  // await fetch(url)
  //   .then(res => res.json())
  //   .then(video => {
  //     json.items[0].snippet.title = video.items[0].snippet.title;
  //     json.items[0].id.videoId = video.items[0].id;
  //     json.items[0].duration = video.items[0].contentDetails.duration;
  //     track = json.items[0];

  //     console.log(`Title: ${json.items[0].snippet.title} id: ${json.items[0].id.videoId} duracao: ${json.items[0].duration}`);
  //   }).catch(err => console.log(err));

  //   console.log(`https://www.youtube.com/watch?v=${videoId}`);
  //   queue.push(track);

  let result =  await ytdl.getBasicInfo(urlTrack);
  let track  = {
    snippet: {
      title: ""
    },
    id: {
      videoId: ""
    },
    duration: ""
  };

  track.snippet.title = result.videoDetails.title;
  track.id.videoId    = result.videoDetails.videoId;
  track.duration      = result.videoDetails.lengthSeconds;

  let queue = global.guildcache.getmeta("queue", message.guildId)
  queue.push(track);
}

async function getTypeQuery(query, message){
  switch (true) {
    case youtubeSongRegex.test(query):
      console.log("youtube song");
      await searchTracksByURL(query, message); 
      break;

    default:
      console.log("string to search");
      await searchTracksByQuery(query, message);
      break;
  }
}

async function play(track, player, guild){
  if (!track) track = "./song0.m4a";
  const stream = ytdl(track, { filter: 'audioonly', quality: 'highestaudio',highWaterMark: 1 << 25, filter: format => format.container === 'webm'})
  let resource = createAudioResource(stream, {
    inputType: StreamType.WebmOpus,
  });
  player.play(resource);
};

async function playQueue(player, message){
    let queue = global.guildcache.getmeta("queue", message.guildId)
    let current = global.guildcache.getmeta("current", message.guildId)
    let videoId = queue[current].id.videoId;
    let url     = `https://www.youtube.com/watch?v=${videoId}`;

    await play(url, player, message.guildId);
}

export default { 
  configSwith, 
  connectToChannel, 
  processQuery, 
  getTypeQuery, 
  playQueue 
}