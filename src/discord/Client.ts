import EventEmitter from "node:events";
import Shard from "./Gateway/Shard.js";

export default class Client extends EventEmitter {
	private _token: string = "";

	constructor(){
		super();
	}

	login(token: string): void {
		this._token = token;
		let shard: Shard = new Shard(this, this._token);
		shard.connect();
	}
}
