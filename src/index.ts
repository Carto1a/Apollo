import express, { Request, Response, Express } from "express";
import "dotenv/config";
import {
	InteractionType,
	InteractionResponseType,
	InteractionResponseFlags,
	MessageComponentTypes,
	ButtonStyleTypes,
} from "discord-interactions";
import Logger from "./logger/index.js";
import { VerifyDiscordRequest } from "./helpers/discord.js";
// import "./websocket.js";
import "./events.js";
const PORT: number = Number(process.env.PORT) || 3000;
const app: Express = express();

app.use(express.json({ verify: VerifyDiscordRequest }));

app.post("/interactions", async (req: Request, res: Response) => {
	const { type, id, data } = req.body;
	Logger.debug(req.body);

	if (type === InteractionType.PING)
		return res.send({ type: InteractionResponseType.PONG });

	if (type === InteractionType.APPLICATION_COMMAND) {
		const { name }: { name: string } = data;

		if (name === "test2")
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: "hello word",
				}
			});
	}
});

app.listen(PORT, () => {
	Logger.info(`Listening on port ${PORT}`);
});

export default app;
