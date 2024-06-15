import FS from "node:fs";

export default class Piper {
	#dataPackets: Array<Buffer>;
	#silence: Buffer;

	constructor(){
		this.#dataPackets = [];
		this.#silence = Buffer.alloc(3);
		this.#silence.writeUint8(0xF8, 0);
		this.#silence.writeUint8(0xFF, 1);
		this.#silence.writeUint8(0xFE, 2);
		


	}

	encode(source: string){
		let sourceStream = FS.createReadStream(source);	

		sourceStream.on("data", this.onData);	
		sourceStream.once("end", this.onEnd);	

	}
	
	getDataPacket(): Buffer | undefined {
		return this.#dataPackets.shift();	
	}
	
	onData(chunk: Buffer | string){
		this.#dataPackets.push(<Buffer>chunk);	
	}
	
	onEnd(){
		this.#dataPackets.push(this.#silence);
	}


}
