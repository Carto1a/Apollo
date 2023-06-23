import { MongoClient } from "mongodb";

export default class GuildCache {
  /**
   *
   * @param {MongoClient} connection
   */

	cache = {};
	template = {};
	meta = {}

  constructor(connection, db, collectionName, template, meta) {
    let database = connection.db(db);
    let collection = database.collection(collectionName);
    this.collection = collection;
		this.template = template;
		this.meta = meta
  }

  async set(item, id, value) {
    let result = await this.collection.findOne({ guildID: id })
    if(!result){
      this.collection.insertOne(this.template);
      this.cache[id] = this.template;
    } else {
      const update = {
        $set: { }
      };
      update.$set[item] = value;

      this.collection.updateOne({guildID: id}, update)
      if (this.cache[id] == undefined) {
        this.cache[id] = {};
      }
      this.cache[id][item] = value;
    }
  }

  async get(item, id) {
    if (this.cache[id] != undefined){
      return this.cache[id][item];
    }
    let result = await this.collection.findOne({ guildID: id })
    if (!result) {
      this.collection.insertOne(this.template);

      if (this.cache[id] == undefined) {
        this.cache[id] = this.template;
      }
      return this.cache[id][item];

    } else {
      if (this.cache[id] == undefined) {
        this.cache[id] = this.template;
      }
      if (this.cache[id][item] == undefined) {
        this.cache[id][item] = await result[item];
      }
      return this.cache[id][item];
    }
  }

  setmeta(item, id, value){
    if (this.cache[id]['meta'] == undefined) {
      this.cache[id]['meta'] = this.meta;
    }
    this.cache[id]['meta'][item] = value;
  }

  getmeta(item, id){
		if(this.cache[id]['meta'] == undefined){
			this.cache[id]['meta'] = this.meta
		}
    return this.cache[id]['meta'][item];
  }
}
