export interface WebsocketStateEvent {
	reconnect: boolean,
	session_id: string,
	resume_gateway_url: string,
	last_event: number | undefined,
};

export interface WebsocketPaylod {
	op: number,
	d: any,
	s: number | undefined,
	t: string | undefined
};

export interface HTTPMessageObject {
	content: string,
	nonce: number | string,
	tts: boolean,
	// embeds:,
	// allowed_mentions:,
	// message_reference:,
	// components:,
	sticker_ids: Array<string>,
	// files:,
	payload_json: string,
	// attachments:,
	flags: number,
}

export interface UserObject {
	id: string,
	username: string,
	discriminator: string,
	global_name: string | undefined,
	avatar: string | undefined,
	bot: boolean,
	system: boolean,
	mfa_enabled: boolean,
	banner: string | undefined,
	accent_color: number | undefined,
	locale: string,
	verified: boolean,
	email: string | undefined,
	flags: number,
	premium_type: number,
	public_flags: number,
	avatar_decoration: string | undefined
};

export interface MessageObject {
	id: string,
	channel_id: string,
	author: UserObject,
	content: string,
	tts: boolean,
};
