
import { hyperlink, inlineCode, bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } from 'discord.js';

function getUserImg(){

}

function setupField(element, pos){
  let link = hyperlink(element.snippet.title, `https://www.youtube.com/watch?v=${element.id.videoId}`)
  pos = inlineCode(pos +'.')
  let duration = inlineCode(element.duration)
  let requestedBy = element.requestedBy
  return {
    name: "",
    value: `${pos} ${link} - ${duration}\n╰ request by: <@${requestedBy}>`,
  }
}

async function queue(message){
  let queue = global.guildcache.getmeta('queue', message.guildId)
  let current = global.guildcache.getmeta('current', message.guildId)

  let fields = []
  if(queue.length == 0){
    const element = queue[current];
    let field = {
      name: "",
      value: `Não há faixas na fila.`,
    }
    fields.push(field)
  } else {
    if(queue.length == current+1){
      const element = queue[current];
      let field = {
        name: "",
        value: `Não há faixas na fila.`,
      }
      fields.push(field)
      fields.push(setupField(element, 0))
    } else {
      let x = (queue.length-current)-1
      let max = x < 10? x : current+10;
      let count = 1
      for (let i = current+1; i < max+1; i++) {
        const element = queue[i];
        fields.push(setupField(element, count))
        count += 1
      }
  
      if(x > 10){
        let pos = inlineCode('N.')
        let field = {
          name: "",
          value: `${pos} ${x} outras faixas...`,
        }
        fields.push(field)
      }
      const element = queue[current];
      fields.push(setupField(element, 0))
    }
  }

  const embed = {
    color: 0x0099ff,
    author: {
      name: `Queue for ${message.guildName} - [${queue.length} tracks]`,
      icon_url: message.guildImgURL,
    },
    fields: fields
  }
  return embed
}

function skip(skips){
  let description = skips == 1? 'Skip the current track': `Skip ${skips} Tracks`
  const embed = {
    color: 0x0099ff,
    description: description,
  }
  return embed
}

function pause(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
}

function resume(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
}

function clearqueue(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
}

function leave(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
}

function loop(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
}

function voltar(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
}

function remove(){
  const embed = {
    color: 0x0099ff,
    author: {
      name: 'Stopped playing',
    },
  }
  return embed
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
  }
}

// user id <@448938461039165440>

async function added(track, message, pos){
  let client = global.guildcache.getmeta('bot', 0)
  let user = await client.users.fetch(message.authorId)
  let userAvatar = await user.displayAvatarURL()
  let requestedBy = track.requestedBy
  let duration = inlineCode(track.duration)
  let name = inlineCode(track.snippet.title)
  let videoId = track.id.videoId
  pos = inlineCode(pos)
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
