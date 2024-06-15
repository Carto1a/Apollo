import WebSocket, { CloseEvent, Data, ErrorEvent, MessageEvent } from "ws";
import Logger from "../logger/index.js";


export default class VoiceConnection {
	token: string;
	guild_id: string;
	url: string;
	ws: WebSocket;
	ssrc: string;
	indentifyPayload: any;

	constructor(
		token: string,
		guild_id: string,
		endpoint: string,
		user_id: string,
		session_id: string
	) {
		this.guild_id = guild_id;
		this.token = token;
		this.url = `wss://${endpoint}?v=4`;
		this.ws = new WebSocket(this.url);
		this.ssrc = "";
		this.indentifyPayload = {
			op: 0,
			d: {
				server_id: guild_id,
				user_id: process.env.BOT,
				session_id:null,
				token: token
			}
		}
		this.initWebSocket();
	}

	initWebSocket() {
		this.ws.on("open", () => {
			Logger.info("voice connection open");

		});
		this.ws.on("close", (event: CloseEvent) => {
			Logger.debug(
				`WebSocket closed with code ${event.code}, reason: ${event.reason}`
			);
			Logger.debug(event);
			// tentar reconectar
			// this.socket_state.reconnect = true;
			// this.connect();
		});
		this.ws.on("error", (event: ErrorEvent) => {
			Logger.debug("WebSocket error...");
			Logger.debug(event.type);
			Logger.debug(event.error);
			Logger.debug(event.message + '\n');
		});
		this.ws.on("message", (data: MessageEvent) => {
			let rawdata: Data = data.data;
			let payload: any = JSON.parse(<string>rawdata);


		});
	}
}
