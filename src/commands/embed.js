import helpers from "../helpers/helpers.js";
import embeds from "../embeds/embeds.js";
import { Message } from "discord.js";

function commandSwith(query0, message) {
  const { command, query, args } = helpers.processQuery(query0, "");

  switch (command) {
    case "queue":
      message.channel.send({embeds: [embeds.added()]})
      break;
    case "play":
      break;
    case "skip":
      break;
    case "playing":
      break;
    default:
      message.reply(`Not a valid command ${command}`);
      break;
  }
}

export default { commandSwith };
