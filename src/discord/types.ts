export interface WebsocketStateEvent {
	reconnect: boolean,
	session_id: string,
	resume_gateway_url: string,
	last_event?: number,
};

export interface WebsocketPaylod {
	op: number,
	d: any,
	s?: number,
	t?: string
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
	global_name?: string,
	avatar?: string,
	bot?: boolean,
	system?: boolean,
	mfa_enabled?: boolean,
	banner?: string,
	accent_color?: number,
	locale?: string,
	verified?: boolean,
	email?: string,
	flags?: number,
	premium_type?: number,
	public_flags?: number,
	avatar_decoration?: string
};

export interface ChannelMentionObject {
	id: string,
	guild_id: string,
	type: number,
	name: string
}

export interface AttachmentObject {
	id: string,
	filename: string,
	description?: string,
	content_type?: string,
	size: number,
	url: string,
	proxy_url: string,
	height?: number,
	width?: number,
	ephemeral?: boolean,
	duration_secs?: number,
	waveform?: string,
	flags?: number
}

export interface EmojiObject {
	id?: string,
	name?: string | null,
	roles?: Array<RoleObject["id"]>,
	user?: UserObject,
	require_colons?: boolean,
	managed?: boolean,
	animated?: boolean,
	available?: boolean
}

// TODO: checar tipo de burst colors
export interface ReactionObject {
	count: number,
	count_details: any,
	me: boolean,
	me_burst: boolean,
	emoji: Partial<EmojiObject>,
	burst_colors: Array<any>,
}

export interface EmbedFooterObject {
	text: string,
	icon_url?: string,
	proxy_icon_url?: string
}

export interface EmbedImageObject {
	url: string,
	proxy_url?: string,
	height?: number,
	width?: number
}

export interface EmbedThumbnailObject {
	url: string,
	proxy_url?: string,
	height?: number,
	width?: number
}

export interface EmbedVideoObject {
	url: string,
	proxy_url?: string,
	height?: number,
	width?: number
}

export interface EmbedProviderObject {
	name?: string,
	url?: string
}

export interface EmbedAuthorObject {
	name: string,
	url?: string,
	icon_url?: string,
	proxy_icon_url?: string
}

export interface EmbedFieldObject {
	name: string,
	value: string,
	inline?: boolean
}

export interface EmbedObject {
	title?: string,
	type?: string,
	description?: string,
	url?: string,
	timestamp?: string,
	color?: number,
	footer?: EmbedFooterObject,
	image?: EmbedImageObject,
	thumbnail?: EmbedThumbnailObject,
	video?: EmbedVideoObject,
	provider?: EmbedProviderObject,
	author?: EmbedAuthorObject,
	fields?: Array<EmbedFieldObject>
}

export interface DefaultReactionObject {
	emoji_id?: string,
	emoji_name?: string
}

export interface WelcomeScreenChannelObject {
	channel_id: string,
	description: string,
	emoji_id?: string,
	emoji_name?: string
}

export interface WelcomeScreenObject {
	description?: string,
	welcome_channels: Array<WelcomeScreenChannelObject>
}

export interface StickerObject {
	id: string,
	pack_id?: string,
	name: string,
	description?: string,
	tags: string,
	asset?: string,
	type: number,
	format_type: number,
	available?: boolean,
	guild_id?: string,
	user?: UserObject,
	sort_value?: number,
}

export interface GuildObject {
	id: string,
	name: string,
	icon?: string,
	icon_hash?: string,
	splash?: string,
	discovery_splash?: string,
	owner?: boolean,
	owner_id: string,
	permissions?: string,
	region?: string,
	afk_channel_id?: string,
	afk_timeout: number,
	widget_enabled?: boolean,
	widget_channel_id?: string,
	verification_level: number,
	default_message_notifications: number,
	explicit_content_filter: number,
	roles: Array<RoleObject>,
	emojis: Array<EmojiObject>,
	features: Array<string>,
	mfa_level: number,
	application_id?: string,
	system_channel_id?: string,
	system_channel_flags: number,
	rules_channel_id?: string,
	max_presences?: number,
	max_members?: number,
	vanity_url_code?: string,
	description?: string,
	banner?: string,
	premium_tier: number,
	premium_subscription_count?: number,
	preferred_locale: string,
	public_updates_channel_id?: string,
	max_video_channel_users?: number,
	max_stage_video_channel_users?: number,
	approximate_member_count?: number,
	approximate_presence_count?: number,
	welcome_screen?: WelcomeScreenObject,
	nsfw_level: number,
	stickers?: Array<StickerObject>,
	premium_progress_bar_enabled: boolean,
	safety_alerts_channel_id?: string
}

export interface ChannelObject {
	id: string,
	type: number,
	guild_id?: string,
	position?: number,
	// permission_overwrites?:
	name?: string,
	topic?: string,
	nsfw?: boolean,
	last_message_id?: string,
	bitrate?: number,
	user_limit?: number,
	rate_limit_per_user?: number,
	recipients?: Array<UserObject>,
	icon?: string,
	owner_id?: string,
	application_id?: string,
	managed?: boolean,
	parent_id?: string,
	last_pin_timestamp?: string,
	rtc_region?: string,
	video_quality_mode?: number,
	message_count?: number,
	member_count?: number,
	// thread_metadata?: 
	// member?:
	default_auto_archive_duration?: number,
	permissions?: string,
	flags?: number,
	total_message_sent?: number,
	// available_tags?:
	applied_tags?: Array<string>,
	default_reaction_emoji?: DefaultReactionObject,
	default_thread_rate_limit_per_user?: number,
	default_sort_order?: number,
	default_forum_layout?: number
}

// Tags with type null represent booleans.
// They will be present and set to null if they are "true",
// and will be not present if they are "false".
export interface RoleTagsObject {
	bot_id?: string,
	integration_id?: string,
	premium_subscriber?: null,
	subscription_listing_id?: string,
	available_for_purchase?: null,
	guild_connections?: null
}

export interface RoleObject {
	id: string,
	name: string,
	color: number,
	hoist: boolean,
	icon?: string,
	unicode_emoji?: string,
	position: number,
	permissions: string,
	managed: boolean,
	mentionable: boolean,
	tags?: RoleTagsObject,
	flags: number
};

export interface MessageObject {
	id: string,
	channel_id: string,
	author: UserObject,
	content: string,
	timestamp: string,
	edited_timestamp?: string;
	tts: boolean,
	mention_everyone: boolean,
	mentions: Array<UserObject>,
	mention_roles: Array<RoleObject>,
	mention_channels?: Array<ChannelMentionObject>,
	// attachments
	embeds: Array<EmbedObject>,
	// reactions
	nonce: number | string,
	pinned: boolean,
	webhook_id: string,
	type: number,
	// activity?:
	// application?
	application_id?: string,
	message_reference?: string,
	flags?: number,
	referenced_message?: MessageObject,
	// interaction?:
	// thread?:
	// components?:
	// sticker_items?:
	// stickers?:
	position?: number,
	// role_subscription_date?:
	// resolved?:
};
