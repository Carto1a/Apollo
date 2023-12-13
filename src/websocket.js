import WebSocket from "ws";
import helpers from "./helpers/helpers.js";
import commands from "./commands/commands.js";

let ws;

let payload = {
  op: 2,
  d: {
    token: process.env.DISCORD_TOKEN,
    intents: 34433,
    properties: {
      os: "linux",
      browser: "chrome",
      device: "chrome",
    },
  },
};

let resume = {
  reconnect: false,
};

function message_create(event_data) {
  let prefix = "!";
  if (event_data.author.bot) return;
  if (event_data.content.slice(0, prefix.length) != prefix) return;

  const { command, query, args } = helpers.processQuery(event_data.content, prefix);
  console.log(`Message from ${event_data.author.username}: ${event_data.content}`);
  console.log(`args: ${args} | command: ${command} | query: ${query}`);

  commands.messageEvent(event_data, command, query, args);
}

function ready(event_data) {
  resume.session_id = event_data.session_id;
  resume.resume_gateway_url = event_data.resume_gateway_url;
  console.log(`Logged in as ${event_data.user.username}!`);
}

function guild_create(event_data) {
  // console.log(event_data);
  let id   = event_data.id;
  let name = event_data.name;
  console.log(`id: ${id} name: ${name}`);
}

function defaultEvent() {
  console.log("não implementado");  
}

const events = {
  "MESSAGE_CREATE": message_create,
  "READY":          ready,
  "GUILD_CREATE":   guild_create
}

function handlerEvent(payload) {
  const { t, d, s } = payload;

  let event_name = t;
  let event_data = d;
  resume.last_event = s;

  console.log(event_name);
  try {
    events[event_name](event_data);
  } catch (error) {
    if(error instanceof TypeError){
      defaultEvent();
    }
  }
}

function connect() {
  if (resume.reconnect) {
    ws = new WebSocket(resume.resume_gateway_url + "/?v=10&encoding=json");
    ws.addEventListener("open", () => {
      let resume_payload = {
        op: 6,
        d: {
          token: process.env.DISCORD_TOKEN,
          session_id: resume.session_id,
          seq: resume.last_event,
        },
      };
      ws.send(JSON.stringify(resume_payload));
      resume.reconnect = false;
    });
  } else {
    ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
    ws.addEventListener("open", (x) => {
      ws.send(JSON.stringify(payload));
    });
  }

  ws.addEventListener("close", (event) => {
    console.log("WebSocket closing...");
    console.log(event);
    console.log(event.code());
    console.log(event.reason());
    // tentar reconectar
    resume.reconnect = true;
    connect();
  });

  ws.addEventListener("error", (code, reason) => {
    console.log("WebSocket error...");
    console.log(code);
    console.log(reason);
  });

  ws.addEventListener("message", function incoming(data) {
    let x = data.data;
    let payload = JSON.parse(x);
    // console.log(payload);

    const { t, op, d, s } = payload;

    // console.log("Opcode: " + op);

    switch (op) {
      case 0:
        handlerEvent(payload);
        break;

      case 7:
        console.log("Reconnect");
        // tentar reconectar
        resume.reconnect = true;
        connect();
        break;

      case 9:
        console.log("Invalid Session");
        if (d) {
          // tentar reconectar
          resume.reconnect = true;
          connect();
        } else {
          // tentar conectar
          resume.reconnect = false;
          connect();
        }
        break;

      case 10:
        const { heartbeat_interval } = d;
        ws.send(JSON.stringify({ op: 1, d: null }));
        setInterval(() => {
          ws.send(JSON.stringify({ op: 1, d: null }));
        }, heartbeat_interval);

        break;

      case 11:
        // console.log("Heartbeat ACK");
        break;
    }
  });
}

connect();

export default ws;
