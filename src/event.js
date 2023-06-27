import { Events } from "discord.js";
import messageCommand from "./commands/commands.js";
import helpers from "./helpers/helpers.js";

import trackSearch from "./searchSongs/index.js";

function events(client) {
  trackSearch.init();

  client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const Guilds = client.guilds.cache.map((guild) => guild);
    Guilds.forEach((element) => {
      console.log(`id: ${element.id} name: ${element.name}`);
    });
  });

  client.on(Events.MessageCreate, async (message) => {
    let prefix = await global.guildcache.get("prefix", message.guildId);
    if (message.author.bot | !(message.content.slice(0, prefix.length) == prefix)) return;

    const { command, query, args } = helpers.processQuery(message.content, prefix);

    console.log(`\nMessage from ${message.author.username}: ${message.content}`);
    console.log(`args ${args} | command ${command} | query ${query}\n`);

    messageCommand.messageEvent(message, command, query, args);
  });
}

export default { events };
