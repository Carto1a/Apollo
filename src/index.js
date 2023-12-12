import express from "express";
import "dotenv/config";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import WebSocket from "ws";
import { VerifyDiscordRequest, getRandomEmoji } from "./helpers/discord.js";
let ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

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

let payload = {
  op: 2,
  d: {
    token: process.env.DISCORD_TOKEN,
    intents: 512,
    properties: {
      os: "linux",
      browser: "chrome",
      device: "chrome",
    },
  },
};

ws.addEventListener("open", function open(x) {
  ws.send(JSON.stringify(payload));
});

ws.addEventListener("close", (event)=>{
  console.log("WebSocket closing...");
});

ws.addEventListener("error", (event)=>{
  console.log("WebSocket error...");
});

ws.addEventListener("message", function incoming(data) {
  let x = data.data;
  let payload = JSON.parse(x);
  console.log(payload);

  const { t, event, op, d } = payload;

  console.log("Opcode: "+op);

  switch (op) {
    case 9:
      console.log("Invalid Session");
      break;
    case 10:
      const { heartbeat_interval } = d;
      ws.send(JSON.stringify({ op: 1, d: null }));
      setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: null }));
      }, heartbeat_interval);

      break;
      case 11:
        console.log("Heartbeat ACK");
        break;
  }

  console.log(t);

  switch (t) {
    // IF MESSAGE IS CREATED, IT WILL LOG IN THE CONSOLE
    case "MESSAGE_CREATE":
      console.log(d.author.username + ": " + d.content);
  }
});

export default app;
