import discord from "../services/discord/index.js";
import { HTTPMessageObject } from "./types.js";

function sendMessage(channelId: string, content: string): void {
	let data: Partial<HTTPMessageObject> = {
		"content": content,
		"tts": false,
	}
	discord.sendMessage(channelId, data);
}

export { sendMessage };
//
//
import Client from "./Client.js";
export default Client;

