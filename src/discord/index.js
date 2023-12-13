import discord from "../services/discord/index.js";

function sendMessage(channelId, content) {
  let data = {
    "content": content,
    "tts": false,
  }
  discord.sendMessage(channelId, data);
}

export default {sendMessage};