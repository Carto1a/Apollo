import { json } from "express";
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
    let fistKey = {}
    let fistKeyName = Object.keys(this.template)[0];
    fistKey[Object.keys(this.template)[0]] = id
    let result = await this.collection.findOne(fistKey)
    if(!result){
      let temp = Object.assign({}, this.template);
      temp[fistKeyName] = id; 
      this.collection.insertOne(temp);
      this.cache[id] = temp;
    } else {
      const update = {
        $set: { }
      };
      update.$set[item] = value;

      this.collection.updateOne(fistKey, update)
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
    let fistKey = {}
    let fistKeyName = Object.keys(this.template)[0];
    fistKey[Object.keys(this.template)[0]] = id
    let result = await this.collection.findOne(fistKey)
    if (!result) {
      let temp = Object.assign({}, this.template);
      temp[fistKeyName] = id; 
      this.collection.insertOne(temp);

      if (this.cache[id] == undefined) {
        this.cache[id] = temp;
      }
      return this.cache[id][item];

    } else {
      let temp = Object.assign({}, this.template);
      temp[fistKeyName] = id; 
      if (this.cache[id] == undefined) {
        this.cache[id] = temp;
      }
      if (this.cache[id][item] == undefined) {
        this.cache[id][item] = await result[item];
      }
      return this.cache[id][item];
    }
  }

  setmeta(item, id, value){
    if(this.cache[id] == undefined){
      this.cache[id] = {}
    }
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

  dump(){
    console.log(this.cache)
  }

}
