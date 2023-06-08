import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config('../')

const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const clusterUrl = "orpheus.mksifda.mongodb.net";
const authMechanism = "DEFAULT";

const uri =
  `mongodb+srv://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const mongo = new MongoClient(uri);

async function connect(){
  try {
    await mongo.connect();
  } catch (error) {
    console.log(error)
  }
  return mongo
}

export default {connect}