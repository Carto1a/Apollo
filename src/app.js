import {
  Client,
  GatewayIntentBits
} from 'discord.js';
import dotenv from 'dotenv';
import events from '../src/event.js';
import GuildCache from './mongoCache.js';
import mongo from '../src/repository/connection.js';

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

let conn = await mongo.connect()

global.guildcache = new GuildCache(conn, "orpheus-discord", "guild", 
{
	guildID: id,
	prefix: "!",
	playlists: undefined,
	channelSongs: undefined,
},
{
	queue: [],
	current: 0,
	playing: false,
})

global.guildcache.setmeta('bot', 0, client)

events.events(client)

client.login(process.env.DISCORD_TOKEN);