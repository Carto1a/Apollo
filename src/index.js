import express from "express";
import "dotenv/config";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import './websocket.js';
import { VerifyDiscordRequest, getRandomEmoji } from "./helpers/discord.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post("/interactions", async (req, res) => {
  const { type, id, data } = req.body;
  console.log(req.body);

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === "test2") {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // content: 'hello word ' + getRandomEmoji(),
          content: "hello word ",
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

// function exitHandler(options, exitCode) {
//   console.log("exiting...");
//   if (exitCode || exitCode === 0) console.log(exitCode);
//   if (options.exit) process.exit();
// }

// [`exit`, 'disconnect', `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
//   process.on(eventType, exitHandler.bind(null, {exit:true}));
// })

// process.on("SIGTERM")

export default app;
