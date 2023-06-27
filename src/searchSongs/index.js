import { fork } from "child_process";
import helpers from "../helpers/helpers.js";
import embeds from "../embeds/embeds.js";

const controller = new AbortController();
const { signal } = controller;

let searchFork;

function init() {
  const ytsearch = fork("./src/searchSongs/ytsearch.js", [], { signal });
  
  ytsearch.on("error", (err) => {
    console.log(err);
  });
  
  ytsearch.on("message", async (data) => {
    let { message, track, typeResquest} = data;
    let queue = global.guildcache.getmeta("queue", message.guildId);
    if(typeResquest == "track"){
      let client = global.guildcache.getmeta('bot', 0)
      let channel = await client.channels.fetch(message.channelId)
      channel.send({embeds: [await embeds.added(track, message, queue.length)]})
    }
    queue.push(track);
    let playing = global.guildcache.getmeta("playing", message.guildId);
    playing ? true : helpers.playQueue(message.guildId);
    global.guildcache.setmeta("playing", message.guildId, true);
    global.guildcache.setmeta("queue", message.guildId, queue);
    // controller.abort();
  });
  
  ytsearch.on("close", function (code) {
    console.log("child process exited with code " + code);
  });

  searchFork = ytsearch

  return ytsearch
}

function search(...args){
  searchFork.send(...args);
}

export default { init, search }