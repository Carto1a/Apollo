import VoiceConnection from "./VoiceConnection.js";

export default class VoiceConnectionManager {
	connections: Map<string, VoiceConnection>;
	constructor(){
		this.connections = new Map();
	}

	add(guild_id: string){
		// this.connections.set(guild_id, )
	}

	delete(guild_id: string){

	}

	getConnection(guild_id: string){

	}

}
