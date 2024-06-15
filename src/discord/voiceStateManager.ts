import Logger from "../logger/index.js";
import { VoiceStateObject } from "./types.js";

export default class VoiceStateManager {
	voiceStateList: Map<string, Partial<VoiceStateObject>>;

	constructor() {
		this.voiceStateList = new Map();
	}

	init(voice_states: Array<Partial<VoiceStateObject>>) {
		voice_states.forEach((element: Partial<VoiceStateObject>) => {
			this.voiceStateList.set(<string>element.user_id, element);
		});
	}

	update() {
	}

	delete(id: string) {
		this.voiceStateList.delete(id);
	}

	add(voice_state: Partial<VoiceStateObject>) {
		if (voice_state.user_id) {
			this.voiceStateList.set(voice_state.user_id, voice_state);
		} else {
			Logger.debug("wtf, user id is undefined");
		}
	}

	channelId(user_id: string): string | undefined {
		return this.voiceStateList.get(user_id)?.channel_id;

	}
}
