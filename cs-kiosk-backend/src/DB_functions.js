import { MongoClient } from "mongodb";
const fs = require('fs');

const buffer = fs.readFileSync("../.mongodb.auth")
const uri = buffer.toString();

const client = new MongoClient(uri)

async function newUser(UN, PS) {
    try {
      const _database = client.db("BulletinDisplay");
      const _collection = _database.collection("users");
      // create a document to insert
      const doc = {
        username: UN,
        password: PS,
      }
      const result = await _database._collection.insertOne(doc);
      //console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);

  async function updUser(oldUN, newUN, newPS) {
    try {
      const database = client.db("BulletinDisplay");
      const haiku = database.collection("users");
      // create a document with just the fields to be updated
      const upDoc = {
        username: newUN,
        password: newPS,
      }
      //update document with given username
      const result = await _database._collection.deleteOne({ username: oldUN, }, { $set: upDoc });
      //console.log(`A document was updated with the _id: ${result.updateId}`);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);

  async function delUser(_UN) {
    try {
      const database = client.db("BulletinDisplay");
      const haiku = database.collection("users");
      //delete document with given username
      const result = await _database._collection.deleteOne({ username: _UN });
      //console.log(`A document was deleted with the _id: ${result.deleteID}`);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);

