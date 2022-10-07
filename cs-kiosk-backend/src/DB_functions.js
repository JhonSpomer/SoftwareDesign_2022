import { MongoClient } from "mongodb";
const fs = require('fs');

const buffer = fs.readFileSync("../.mongodb.auth")
const uri = buffer.toString();

const client = new MongoClient(uri)

async function newUser(UN, PS) {
    try {
      const database = client.db("BulletinDisplay");
      const haiku = database.collection("users");
      // create a document to insert
      const doc = {
        username: UN,
        password: PS,
      }
      const result = await users.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
