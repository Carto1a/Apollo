import EventEmitter from "node:events";

import Logger from "../../logger/index.js";
import {
	WSMessageObject,
	WebsocketPaylod
} from "../types.js";
import Client from "../Client.js";
import { WebsocketStateEvent } from "../types.js";

export default class Events extends EventEmitter {
	socket_state: WebsocketStateEvent = {
		reconnect: false,
		session_id: "",
		resume_gateway_url: ""
	}
	events: Record<string, (x: any) => void> = {
		"MESSAGE_CREATE": this.message_create,
		"READY": this.ready,
		"GUILD_CREATE": this.guild_create,
		"VOICE_STATE_UPDATE": this.voice_state_update,
		"VOICE_SERVER_UPDATE": this.voice_server_update,

	}

	protected _token: string = "";
	_client: Client;

	constructor(client: Client, token: string) {
		super();
		this._token = token;
		this._client = client;
	}

	handleEvent(payload: WebsocketPaylod) {
		let event_name: string = <string>payload.t;
		let event_data = payload.d;
		this.socket_state.last_event = payload.s;

		Logger.trace(event_name);
		Logger.trace(JSON.stringify(event_data));
	}

	message_create(event_data: WSMessageObject) {
		this._client.emit("message_create", event_data);
	}

	ready() {

	}

	guild_create() {

	}

	voice_state_update() {

	}

	voice_server_update() {

	}

}
