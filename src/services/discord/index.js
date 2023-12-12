import { discord_api_v10 } from "../api.js";

async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
  try {
    let res = await discord_api_v10.put(`/applications/${appId}/commands`, commands);
    return res;
  } catch (error) {
    console.log(error.constructor.name);
    if (error instanceof AxiosError) {
      console.log(error.response.status);
      console.log(error.response.data.message);
    } else if (error instanceof ReferenceError) {
      console.log(error.message);
    }
    throw error;
  }
}

async function getDiscordGateway(appId, commands) {
  // API endpoint to overwrite global commands
  // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
  try {
    let res = await discord_api_v10.put(`/applications/${appId}/commands`, commands);
    return res;
  } catch (error) {
    console.log(error.constructor.name);
    if (error instanceof AxiosError) {
      console.log(error.response.status);
      console.log(error.response.data.message);
    } else if (error instanceof ReferenceError) {
      console.log(error.message);
    }
    throw error;
  }
}

export {InstallGlobalCommands};