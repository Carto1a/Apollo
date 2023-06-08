import { MongoClient } from "mongodb";

export default class GuildCache {
  /**
   *
   * @param {MongoClient} connection
   */
  constructor(connection) {
    this.list = {};
    let database = connection.db("orpheus-discord");
    let collection = database.collection("guild");
    this.collection = collection;
  }

  existguild(guild) {}

  checkcache(){}

  async set(item, guild, value) {
    let result = await this.collection.findOne({ guildID: guild })
    if(!result){
      this.collection.insertOne({
        guildID: guild,
        prefix: "!",
        playlists: "",
        channelSongs: "",
      });
      this.list[guild] = {};
      this.list[guild]['prefix'] = '!'
      this.list[guild][item] = value
    } else {
      const update = {
        $set: { }
      };
      update.$set[item] = value;

      this.collection.updateOne({guildID: guild}, update)
      if (this.list[guild] == undefined) {
        this.list[guild] = {};
      }
      this.list[guild][item] = value;
    }
  }

  async get(item, guild) {
    if (this.list[guild] != undefined){
      return this.list[guild][item];
    }
    let result = await this.collection.findOne({ guildID: guild })
    if (!result) {
      this.collection.insertOne({
        guildID: guild,
        prefix: "!",
        playlists: "",
        channelSongs: "",
      });

      if (this.list[guild] == undefined) {
        this.list[guild] = {};
      }
      if (this.list[guild][item] == undefined) {
        this.list[guild][item] = item == 'prefix'? "!":"";;
      }
      return this.list[guild][item];

    } else {
      if (this.list[guild] == undefined) {
        this.list[guild] = {};
      }
      if (this.list[guild][item] == undefined) {
        this.list[guild][item] = await result[item];
      }
      return this.list[guild][item];
    }
  }

  setmeta(item, guild, value){
    if (this.list[guild] == undefined) {
      this.list[guild] = {};
    }
    this.list[guild][item] = value;
  }

  getmeta(item, guild){
    if (this.list[guild]["queue"] == undefined) {
      this.list[guild]["queue"] = []
      this.list[guild]["current"] = 0
      this.list[guild]['playing'] = false
    }
    return this.list[guild][item];
  }
}
