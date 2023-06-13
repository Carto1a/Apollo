
import { inlineCode, bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } from 'discord.js';

function getUserImg(){

}

function queue(){


  const embed = {
    color: 0x0099ff,
    title: '`nome da musica`',
    url: `https://www.youtube.com/watch?v=${videoId}`,
    author: {
      name: 'ADDED TO QUEUE',
      icon_url: 'https://i.imgur.com/AfFp7pu.png',
      // url: 'https://discord.js.org',
    },
    description: 'Added By: Nomeda pessoa | Duration `2m 47s` | Position In Queue: `5`',
    // thumbnail: {
    //   url: 'https://i.imgur.com/AfFp7pu.png',
    // },
    // fields: [
    //   {
    //     name: 'Regular field title',
    //     value: 'Some value here',
    //   },
    //   {
    //     name: '\u200b',
    //     value: '\u200b',
    //     inline: false,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    // ],
    // image: {
    //   url: 'https://i.imgur.com/AfFp7pu.png',
    // },
    // timestamp: new Date().toISOString(),
    // footer: {
    //   text: 'Added By',
    //   // icon_url: 'https://i.imgur.com/AfFp7pu.png',
    // },
  }
}

function skip(){
  const embed = {
    color: 0x0099ff,
    title: '`nome da musica`',
    url: 'https://discord.js.org',
    author: {
      name: 'ADDED TO QUEUE',
      icon_url: 'https://i.imgur.com/AfFp7pu.png',
      // url: 'https://discord.js.org',
    },
    description: 'Added By: Nomeda pessoa | Duration `2m 47s` | Position In Queue: `5`',
    // thumbnail: {
    //   url: 'https://i.imgur.com/AfFp7pu.png',
    // },
    // fields: [
    //   {
    //     name: 'Regular field title',
    //     value: 'Some value here',
    //   },
    //   {
    //     name: '\u200b',
    //     value: '\u200b',
    //     inline: false,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    // ],
    // image: {
    //   url: 'https://i.imgur.com/AfFp7pu.png',
    // },
    // timestamp: new Date().toISOString(),
    // footer: {
    //   text: 'Added By',
    //   // icon_url: 'https://i.imgur.com/AfFp7pu.png',
    // },
  }
}

function playing(){
  const embed = {
    color: 0x0099ff,
    title: '`nome da musica`',
    url: 'https://discord.js.org',
    author: {
      name: 'ADDED TO QUEUE',
      icon_url: 'https://i.imgur.com/AfFp7pu.png',
      // url: 'https://discord.js.org',
    },
    description: 'Added By: Nomeda pessoa | Duration `2m 47s` | Position In Queue: `5`',
    // thumbnail: {
    //   url: 'https://i.imgur.com/AfFp7pu.png',
    // },
    // fields: [
    //   {
    //     name: 'Regular field title',
    //     value: 'Some value here',
    //   },
    //   {
    //     name: '\u200b',
    //     value: '\u200b',
    //     inline: false,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    //   {
    //     name: 'Inline field title',
    //     value: 'Some value here',
    //     inline: true,
    //   },
    // ],
    // image: {
    //   url: 'https://i.imgur.com/AfFp7pu.png',
    // },
    // timestamp: new Date().toISOString(),
    // footer: {
    //   text: 'Added By',
    //   // icon_url: 'https://i.imgur.com/AfFp7pu.png',
    // },
  }
}

// user id <@448938461039165440>

async function added(track, message){
  let client = global.guildcache.getmeta('bot', 0)
  let user = await client.users.fetch(message.authorId)
  let userAvatar = await user.displayAvatarURL()
  let requestedBy = track.requestedBy
  let duration = inlineCode(track.duration)
  let pos = 0
  let name = inlineCode(track.snippet.title)
  let author = ""
  let videoId = track.id.videoId

  const embed = {
    color: 0x0099ff,
    title: `${name}`,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    author: {
      name: 'ADDED TO QUEUE',
      icon_url: userAvatar,
    },
    description: `Added By: <@${requestedBy}> | Duration ${duration} | Position In Queue: ${pos}`,
  };
  return embed
}

export default { added, playing, queue, skip}
