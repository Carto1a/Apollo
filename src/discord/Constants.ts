export enum GateWayOPs {
	"Dispatch",
	"Heartbeat",
	"Identify",
	"PresenceUpdate",
	"VoiceStateUpdate",
	"Resume" = 6,
	"Reconnect",
	"RequestGuildMembers",
	"InvalidSession",
	"Hello",
	"HeartbeatACK"
}

export enum VoiceOps {
	"Identify",
	"SelectProtocol",
	"Ready",
	"Heartbeat",
	"SessionDescription",
	"Speaking",
	"HeartbeatACK",
	"Resume",
	"Hello",
	"Resumed",
	"ClientDisconnect" = 13,
}
