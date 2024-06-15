import Client from "./discord/index.js";

let client: Client = new Client();

client.on("open", (x: Date) => {
	console.log(x);
})

client.login(<string>process.env.DISCORD_TOKEN);
