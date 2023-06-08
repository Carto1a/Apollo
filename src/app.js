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
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits
} from 'discord.js';
import dotenv from 'dotenv';
import { json } from 'express';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import mongo from '../src/repository/connection.js';
import events from '../src/event.js'
import GuildCache from '../src/guildcache.js'

dotenv.config()

const client = new Client({
  intents: [
    "Guilds",
    "GuildVoiceStates",
		"GuildMessages",
    GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent
  ]
});

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

let conn = await mongo.connect()

// guildID
// prefix
// playlists
// channelSongs
global.guildcache = new GuildCache(conn)

events.eventsClient(client, player)

client.login(process.env.DISCORD_TOKEN);