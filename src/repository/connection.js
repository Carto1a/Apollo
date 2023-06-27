import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config('../')

const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const clusterUrl = process.env.MONGO_URL;
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