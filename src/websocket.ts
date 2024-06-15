import WebSocket, { CloseEvent, ErrorEvent, MessageEvent } from "ws";
import helpers from "./helpers/helpers.js";
import commands from "./commands/index.js";
import {
	WebsocketStateEvent,
	WebsocketPaylod,
	MessageObject,
	WSMessageObject,
	WSGuildObject,
	VoiceStateObject
} from "./discord/types.js";
import { ProcessedQuery } from "./types.js";
import Logger from "./logger/index.js";
import VoiceStateManager from "./discord/voiceStateManager.js";
import VoiceConnectionManager from "./voice/VoiceConnectionManager.js";
import EventEmitter from "node:events";

let init_payload: WebsocketPaylod = {
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

class DiscordWebsocket extends EventEmitter {
	socket_state: WebsocketStateEvent = {
		reconnect: false,
		session_id: "",
		resume_gateway_url: "",
	};

	ws: WebSocket;
	voiceConnectionManager: VoiceConnectionManager;

	events: Record<string, (x: any) => void> = {
		"MESSAGE_CREATE": this.message_create,
		"READY": this.ready,
		"GUILD_CREATE": this.guild_create,
		"VOICE_STATE_UPDATE": this.voice_state_update,
		"VOICE_SERVER_UPDATE": this.voice_server_update,
	}

	voiceStates: VoiceStateManager;
	guildList: Map<string, Partial<WSGuildObject>>;

	constructor() {
		super();
		this.ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
		this.guildList = new Map();
		this.voiceStates = new VoiceStateManager();
		this.voiceConnectionManager = new VoiceConnectionManager();
		this.connect();
	}

	connect() {
		if (this.socket_state.reconnect) {
			Logger.debug(`Try reconnect with ${this.socket_state.resume_gateway_url}`);
			this.ws = new WebSocket(this.socket_state.resume_gateway_url + "/?v=10&encoding=json");
			this.ws.addEventListener("open", () => {
				let resume_payload: WebsocketPaylod = {
					op: 6,
					d: {
						token: process.env.DISCORD_TOKEN,
						session_id: this.socket_state.session_id,
						seq: this.socket_state.last_event,
					},
				};
				this.ws.send(JSON.stringify(resume_payload));
				this.socket_state.reconnect = false;
			});
		} else {
			this.ws.addEventListener("open", () => {
				Logger.info("WebSocket open");
				this.ws.send(JSON.stringify(init_payload));
			});
		}
		this.ws.addEventListener("close", (event: CloseEvent) => {
			Logger.debug(`WebSocket closed with code ${event.code}, reason: ${event.reason}`);
			Logger.debug(event);
			// tentar reconectar
			this.socket_state.reconnect = true;
			this.connect();
		});

		this.ws.addEventListener("error", (event: ErrorEvent) => {
			Logger.debug("WebSocket error...");
			Logger.debug(event.type);
			Logger.debug(event.error);
			Logger.debug(event.message + '\n');
		});

		this.ws.addEventListener("message", (data: any) => {
			let x: string = data.data;
			let payload: WebsocketPaylod = JSON.parse(x);
			this.handlerMessage(payload);
		});
	}

	handlerMessage({ t, op, d, s }: WebsocketPaylod): void {
		Logger.debug("Opcode: " + op);
		switch (op) {
			case 0:
				this.handlerEvent({ t, op, d, s });
				break;
			case 1:
				// TODO: colocar alguma coisa no d
				this.ws.send(JSON.stringify({ op: 1, d: null }));
				break;
			case 7:
				Logger.debug("Reconnect");
				// tentar reconectar
				this.socket_state.reconnect = true;
				this.connect();
				break;
			case 9:
				Logger.debug("Invalid Session");
				if (d) {
					// tentar reconectar
					this.socket_state.reconnect = true;
					this.connect();
				} else {
					// tentar conectar
					this.socket_state.reconnect = false;
					this.connect();
				}
				break;

			case 10:
				const { heartbeat_interval } = d;
				setInterval(() => {
					// TODO: colocar alguma coisa no d
					this.ws.send(JSON.stringify({ op: 1, d: null }));
				}, heartbeat_interval);

				break;

			case 11:
				Logger.trace("Heartbeat ACK");
				break;
		}
	}

	handlerEvent(payload_event: WebsocketPaylod): void {
		const { t, d, s }: WebsocketPaylod = payload_event;
		Logger.debug(JSON.stringify(payload_event));

		let event_name = t;
		let event_data = d;
		this.socket_state.last_event = s;

		Logger.debug(event_name);
		let func = this.events[<string>event_name]?.bind(this);
		if (func != undefined) {
			func(event_data)
		} else {
			this.defaultEvent();
		}
	}

	// Websocket receiver events
	message_create(event_data: WSMessageObject) {
		let prefix: string = "!";
		if (event_data.author.bot) return;
		if (event_data.content.slice(0, prefix.length) != prefix) return;

		const { command, query, args }: ProcessedQuery = helpers.processQuery(event_data.content, prefix);
		Logger.debug(`Message from ${event_data.author.username}: ${event_data.content}`);
		Logger.debug(`args: ${args} | command: ${command} | query: ${query}`);

		commands.messageEvent(event_data, { command, query, args });
	}

	ready(event_data: any) {
		Logger.trace(JSON.stringify(event_data));
		this.socket_state.session_id = event_data.session_id;
		this.socket_state.resume_gateway_url = event_data.resume_gateway_url;
		Logger.trace("socket_state");
		Logger.trace(JSON.stringify(this.socket_state));
		Logger.info(`Logged in as ${event_data.user.username}!`);
	}

	guild_create(event_data: WSGuildObject) {
		let id = event_data.id;
		let name = event_data.name;
		Logger.info(`id: ${id} name: ${name}`);

		if (event_data.voice_states.length != 0)
			this.voiceStates.init(event_data.voice_states);
	}

	voice_state_update(event_data: VoiceStateObject) {
		Logger.debug(JSON.stringify(event_data));
		if (event_data.channel_id != null) {
			this.voiceStates.add(event_data);
		} else {
			this.voiceStates.delete(event_data.user_id);
		}
	}

	voice_server_update(event_data: VoiceStateObject) {

	}

	defaultEvent() {
		Logger.debug("não implementado");
	}

	requestGuildMember(guild_id: string, user_id: string) {
		let payload = {
			op: 8,
			d: {
				guild_id,
				user_ids: user_id
			}
		};
		this.ws.send(JSON.stringify(payload));
	}

	requestVoiceChannel(message: WSMessageObject) {
		// this.requestGuildMember(message.guild_id, message.author.id);
		let channel_id: string | undefined = this.voiceStates.channelId(message.author.id);
		if (channel_id == undefined) {
			Logger.trace("usuario não esta em um canal de voz");
		} else {
			let payload: WebsocketPaylod = {
				op: 4,
				d: {
					guild_id: message.guild_id,
					channel_id,
					self_mute: false,
					self_deaf: false
				}
			};
			this.ws.send(JSON.stringify(payload));
		}
	}
}

const discord_websocket: DiscordWebsocket = new DiscordWebsocket();
export default discord_websocket;
