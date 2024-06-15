import EventEmitter from "node:events";
import WebSocket,
{
	CloseEvent,
	Data,
	ErrorEvent,
	MessageEvent,
	RawData,
} from "ws";

import {
	WebsocketPaylod,
	WebsocketStateEvent,

} from "../types.js";

import {
	GateWayOPs
} from "../Constants.js";

import Events from "./Events.js";
import Logger from "../../logger/index.js";
import Client from "../Client.js";

const wsurl = "wss://gateway.discord.gg/";


export default class Shard extends Events {

	static identify_payload: WebsocketPaylod = {
		op: GateWayOPs.Identify,
		d: {
			token: undefined,
			intents: 34433,
			properties: {
				os: "linux",
				browser: "chrome",
				device: "chrome",
			},
		},
	};

	ws: WebSocket;
	constructor(client: Client, token: string) {
		super(client, token);
		Shard.identify_payload.d.token = this._token;
		this.ws = new WebSocket(`${wsurl}?v=10&encoding=json`);
	}

	connect() {
		if (this.socket_state.reconnect) {
			Logger.debug(`Try reconnect with ${this.socket_state.resume_gateway_url}`);
			this.ws = new WebSocket(
				this.socket_state.resume_gateway_url + "/?v=10&encoding=json"
			);
			// tentar reconectar
			this.ws.on("open", () => {
				let resume_payload: WebsocketPaylod = {
					op: GateWayOPs.Resume,
					d: {
						token: this._token,
						session_id: this.socket_state.session_id,
						seq: this.socket_state.last_event,
					},
				};
				this.ws.send(JSON.stringify(resume_payload));
				this.socket_state.reconnect = false;
			});
		} else {
			// iniciando pela primeira vez
			this.ws.on("open", () => {
				Logger.debug("WebSocket open");
				this.ws.send(JSON.stringify(Shard.identify_payload));
				this._client.emit("open", Date.now());
			});
		}
		this.ws.on("close", (event: CloseEvent) => {
			Logger.debug(`WebSocket closed with code ${event.code}, reason: ${event.reason}`);
			Logger.debug(event);
			// tentar reconectar
			this.socket_state.reconnect = true;
			this.connect();
		});
		this.ws.on("error", (event: ErrorEvent) => {
			Logger.debug("WebSocket error...");
			Logger.debug(event.type);
			Logger.debug(event.error);
			Logger.debug(event.message + '\n')
		});
		this.ws.on("message", (event: RawData) => {
			let x: string = event.toString();
			let payload: WebsocketPaylod = JSON.parse(x);

			switch (payload.op) {
				case GateWayOPs.Dispatch:
					this.handleEvent(payload);
					break;
				case GateWayOPs.Heartbeat:
					// TODO: colocar alguma coisa no d
					this.ws.send(JSON.stringify({ op: GateWayOPs.Heartbeat, d: null }));

					break;
				case GateWayOPs.Reconnect:
					Logger.debug("Reconnect");
					this.socket_state.reconnect = true;
					this.connect();

					break;
				case GateWayOPs.InvalidSession:
					Logger.debug("Invalid Session");
					if (payload.d) {
						// tentar reconectar
						this.socket_state.reconnect = true;
						this.connect();
					} else {
						// tentar conectar
						this.socket_state.reconnect = false;
						this.connect();
					}

					break;
				case GateWayOPs.Hello:
					const { heartbeat_interval } = payload.d;
					setInterval(() => {
						// TODO: colocar alguma coisa no d
						this.ws.send(JSON.stringify({ op: GateWayOPs.Heartbeat, d: null }));
					}, heartbeat_interval);

					break;
				case GateWayOPs.HeartbeatACK:
					Logger.trace("Heartbeat ACK");

					break;
				default:
					Logger.debug("Gateway op not impremented");

					break;

			}
		});
	}
}
