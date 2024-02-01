import fetch from "node-fetch";
import { verifyKey } from "discord-interactions";
import { Request, Response } from "express";

function VerifyDiscordRequest(req: Request, res: Response, buf: Buffer, encoding: string): void {
	const signature: any = req.get('X-Signature-Ed25519');
	const timestamp: any = req.get('X-Signature-Timestamp');
	const clientKey: any = process.env.PUBLIC_KEY;

	const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
	if (!isValidRequest) {
		res.status(401).send('Bad request signature');
		throw new Error('Bad request signature');
	}
}

function getRandomEmoji(): string {
	const emojiList: Array<string> = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨'];
	return emojiList[Math.floor(Math.random() * emojiList.length)];
}

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
	VerifyDiscordRequest,
	getRandomEmoji,
	capitalize
}
