import axios, { AxiosError } from "axios";

const discord_api_v10 = axios.create({
	baseURL: "https://discord.com/api/v10",
});

discord_api_v10.interceptors.request.use((config: any) => {
	try {
		config.headers['Authorization'] = `Bot ${process.env.DISCORD_TOKEN}`;
		config.headers['Content-Type'] = 'application/json; charset=UTF-8';
		config.headers['User-Agent'] = 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)';
	} catch (error: any) {
		console.log("error on initial setup of a request: " + error.constructor.name);
	} finally {
		return config;
	}
});

discord_api_v10.interceptors.response.use(null, (error: AxiosError) => {
	if(!error.response)
		console.log("discord api error");
	
	return Promise.reject(error);
})

export { discord_api_v10, discord_api_v10 as discord_api };
