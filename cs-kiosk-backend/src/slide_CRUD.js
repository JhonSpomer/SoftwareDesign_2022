import { MongoClient } from "mongodb";
const fs = require('fs');

const buffer = fs.readFileSync("../.mongodb.auth")
const uri = buffer.toString();

const client = new MongoClient(uri)
const _DB = client.db("BulletinDisplay");
const bucket = new mongodb.GridFSBucket(_DB, { bucketName: 'newSlides' });

async function newSlide() {
    try {


      const result = await _database._collection.insertOne(doc);
      //console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);