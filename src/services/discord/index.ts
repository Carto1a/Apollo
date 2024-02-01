import { AxiosError, AxiosResponse } from "axios";
import { discord_api_v10 } from "../api.js";
import { MessageObject, HTTPMessageObject } from "../../discord/types.js";

async function InstallGlobalCommands(appId: string, commands: any): Promise<AxiosResponse> {
	try {
		let res: AxiosResponse = await discord_api_v10.put(`/applications/${appId}/commands`, commands);
		return res;
	} catch (error: any) {
		console.log(error.constructor.name);
		if (error instanceof AxiosError) {
			error = <AxiosError>error;
			console.log(error.response.status);
			console.log(error.response.data.message);
		} else if (error instanceof ReferenceError) {
			console.log(error.message);
		}
		throw error;
	}
}

async function getDiscordGateway(appId: string, commands: string): Promise<AxiosResponse> {
	try {
		let res: AxiosResponse = await discord_api_v10.put(`/applications/${appId}/commands`, commands);
		return res;
	} catch (error: any) {
		console.log(error.constructor.name);
		if (error instanceof AxiosError) {
			error = <AxiosError>error;
			console.log(error.response.status);
			console.log(error.response.data.message);
		} else if (error instanceof ReferenceError) {
			console.log(error.message);
		}
		throw error;
	}
}

async function sendMessage(channelId: string, data: Partial<HTTPMessageObject>): Promise<any> {
	try {
		let res: AxiosResponse = await discord_api_v10.post(`/channels/${channelId}/messages`, data);
		return res.data;
	} catch (error: any) {
		console.log(error.constructor.name);
		if (error instanceof AxiosError) {
			error = <AxiosError>error;
			console.log(error.response.status);
			console.log(error.response.data.message);
		} else if (error instanceof ReferenceError) {
			console.log(error.message);
		}
		throw error;
	}
}

export { InstallGlobalCommands };
export default { InstallGlobalCommands, sendMessage };
