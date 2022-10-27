const mongo = require("mongodb");
const fs = require('fs');

const buffer = fs.readFileSync("../.mongodb.auth")
const uri = buffer.toString();

const client = new mongo.MongoClient(uri)
const _database = client.db("BulletinDisplay");
const _collection = _database.collection("users");
const bucket = new mongo.GridFSBucket(_database, { bucketName: 'newSlides' });

module.exports = {
    newUser: async function (UN, PS) {
        try {
            // create a document to insert
            const doc =
            {
                username: UN,
                password: PS,
            };
            const result = await _database._collection.insertOne(doc);
            //console.log(`A document was inserted with the _id: ${result.insertedId}`);
        }
        finally {
            await client.close();
        }
    },

    updUser: async function (oldUN, newUN, newPS) {
        try {
            if (newUN === undefined) {
                newUN = oldUN;
            };
            // create a document with just the fields to be updated
            const upDoc =
            {
                username: newUN,
                password: newPS,
            };
            //update document with given username
            //upsert set to true - will insert given document if it does not already exixst
            const result = await _database._collection.updateOne({ username: oldUN, }, { $set: upDoc }, { upsert: true });
            console.log(`A document was updated with the _id: ${result.updateId._id}`);
        }
        finally {
            await client.close();
        }
    },


    delUser: async function (_UN) {
        try {
            //delete document with given username
            const result = await _database._collection.deleteOne({ username: _UN });
            console.log(`A document was deleted with the _id: ${result.deleteID._id}`);
        }
        finally {
            await client.close();
        }
    },

    getUser: async function (UN, PS) {
        //how are we handling checking users against the user DB?
    },

    delSlide: async function (_targetID) {
        try {
            return bucket.delete(ObjectId(_targetID));
        }
        finally {
            await client.close();
        }
    },


    modSlide: async function (_RS, _name, _type, _user, _date, _expDate, targetID) {
        try {
            if (targetID === undefined) {
                const result = _RS.pipeTo(bucket.openUploadStream(_name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate } }));
                //console.log('A slide file was added with the id: ${result.uploadID._id}');
            }
            else {
                //delete old slide
                await delSlide(targetID);
                //upload new slide
                const result = _RS.pipeTo(bucket.openUploadStream(_name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate } }));
                //console.log('A slide file was added with the _id: ${result.insertedId}');
            }
        }
        finally {
            await client.close();
        }
    },


    getSlide: async function (_targetID) {
        try {
            return bucket.openDownloadStream(ObjectId(_targetID));
        }
        finally {
            await client.close();
        }
    }
};



