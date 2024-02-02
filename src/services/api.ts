import axios, { AxiosError } from "axios";
import Logger from "../logger/index.js";

const discord_api_v10 = axios.create({
	baseURL: "https://discord.com/api/v10",
});

discord_api_v10.interceptors.request.use((config: any) => {
	try {
		config.headers['Authorization'] = `Bot ${process.env.DISCORD_TOKEN}`;
		config.headers['Content-Type'] = 'application/json; charset=UTF-8';
		config.headers['User-Agent'] = 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)';
	} catch (error: any) {
		Logger.fatal(`error on initial setup of a request ${error.constructor.name}`);
	} finally {
		return config;
	}
});

discord_api_v10.interceptors.response.use(null, (error: AxiosError) => {
	if(!error.response)
		Logger.error(`discord api error`);
	return Promise.reject(error);
})

export { discord_api_v10, discord_api_v10 as discord_api };
