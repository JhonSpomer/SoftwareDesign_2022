const
    mongodb = require("mongodb"),
    fs = require('fs');

const buffer = fs.readFileSync("../.mongodb.auth");
const uri = buffer.toString();

const client = new mongodb.MongoClient(uri);
const database = client.db("BulletinDisplay");
const users = database.collection("users");
const slides = database.collection("slides");
const config = database.collection("Config_data");
const bucket = new mongodb.GridFSBucket(database, { bucketName: 'slideFiles' });

module.exports = {
    newUser: async function (UN, PS) {
        await client.connect();
        try {
            // create a document to insert
            const doc =
            {
                username: UN,
                password: PS,
            };
            const result = await users.insertOne(doc);
            //console.log(`A document was inserted with the _id: ${result.insertedId}`);
            return result.insertedId.toHexString();
        }
        finally {
            // await client.close();
        }
    },

    modUser: async function (oldUN, newUN, newPS) {
        await client.connect();
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
            const result = await users.updateOne({ username: oldUN, }, { $set: upDoc }, { upsert: true });
            //console.log(`A document was updated with the _id: ${result.upsertedId}`);
            return result.upsertedId.toHexString();
        }
        finally {
            // await client.close();
        }
    },


    delUser: async function (_UN) {
        await client.connect();
        try {
            //delete document with given username
            const result = await users.deleteOne({ username: _UN });
            //console.log(`${result.deletedCount} document(s) deleted.`);
        }
        finally {
            // await client.close();
        }
    },

    getUser: async function (UN, PS) {
        await client.connect();
        let user;
        try {
            user = await users.findOne({ username: UN, password: PS }, { username: 1, password: 1 });
        }
        finally {
            return user;
        }
    },

    modSlide: async function (_slideName, _slideType, _user, _date, _expDate, _content, targetID) {
        await client.connect();
        try {
            //if no existing document ID is provided, create a new slide record.
            if (!targetID) {
                // slide metadata document
                const slideDoc =
                {
                    slide_name: _slideName,
                    slide_type: _slideType,
                    owner: _user,
                    lastModifiedBy: _user,
                    expiration_date: _expDate,
                    content: _content
                };
                const result = await slides.insertOne(slideDoc, { upsert: true });
                console.log(`A document was updated with the _id: ${result.upsertedId}`);
                return result.upsertedId.toHexString();
            }
            else {
                // slide metadata document
                const slideDoc =
                {
                    name: _slideName,
                    type: _slideType,
                    // an existing document should already have an owner.
                    lastModifiedBy: _user,
                    expiration_date: _expDate,
                    content: _content
                };
                const result = await slides.updateOne({ _id:targetID }, { $set: slideDoc }, { upsert: true });
                console.log(`A document was updated with the _id: ${result.upsertedId}`);
                return result.upsertedId.toHexString();
            }
           //console.log(`A document was updated with the _id: ${result.upsertedId}`);
           
        }
        finally {
            // await client.close();
        }
    },

    updSlide: async function (_slideName, _slideType, _user, _date, _expDate, targetID) {
        await client.connect();
        try {
            //if no existing document ID is provided, create a new slide record.
            if (targetID === undefined) {
                // slide metadata document
                const slideDoc =
                {
                    slide_name: _slideName,
                    slide_type: _slideType,
                    owner: _user,
                    lastModifiedBy: _user,
                    expiration_date: _expDate
                };
                const result = await slides.updateOne({_id:targetID}, { $set: slideDoc  }, { upsert: true });
                console.log(`A document was updated with the _id: ${result.upsertedId}`);
            }
            else {
                // slide metadata document
                const slideDoc =
                {
                    slide_name: _slideName,
                    slide_type: _slideType,
                    // an existing document should already have an owner.
                    lastModifiedBy: _user,
                    expiration_date: _expDate
                };
                const result = await slides.updateOne({ _id:targetID }, { $set: slideDoc }, { upsert: true });
                console.log(`A document was updated with the _id: ${result.upsertedId}`);
            }
            console.log(`A document was updated with the _id: ${result.upsertedId}`);
        }
        finally {
            // await client.close();
        }
    },


    delSlide: async function (_targetID) {
        await client.connect();
        try {
            //delete document with given uID
            const result = await slides.deleteOne({ _id: _targetID });
            console.log(`${result.deletedId} document(s) deleted.`);
        }
        finally {
            // await client.close();
        }
    },

    getSlide: async function (targetID) {
        await client.connect();
        var slide;
        try {
            slide = slides.findOne({ _id: targetID }, { _slideName: 1, _slideType: 1, _user: 1, _date: 1, _expDate: 1, _id: 1 });
        }
        finally {
            return slide;
        }
    },

    delFile: async function (_targetID) {
        await client.connect();
        try {
            //delete document with given uID
            const result = await slides.deleteOne({ _id: _targetID });
            console.log(`${result.deletedId} document(s) deleted.`);
        }
        finally {
            // await client.close();
        }
    },

    getSlide: async function (targetID) {
        await client.connect();
        let slide;
        try {
            slide = await slides.findOne({ _id: mongodb.ObjectId(targetID) });
            return slide;
        }
        finally {
        }
    },

    delFile: async function (_targetID) {
        await client.connect();
        try {
            return bucket.delete(mongodb.ObjectId(_targetID));
        }
        finally {
            // await client.close();
        }
    },


    modFile: async function (_RS, _name, _type, _user, _date, _expDate, targetID) {
        await client.connect();
        try {
            if (targetID === undefined) {
                const stream = bucket.openUploadStream(_name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate } });
                const result = await _RS.pipe(stream);
                //console.log('A slide file was added with the id: ${result.uploadID._id}');
                return stream.id.toHexString();
            }
            else {
                // //delete old slide
                await delSlide(targetID);
                //upload new slide
                const stream = bucket.openUploadStreamWithId(targetID, _name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate } });
                const result = await _RS.pipe(stream);
                //console.log('A slide file was added with the _id: ${result.insertedId}');
                return stream.id.toHexString();
            }
            
        }
        finally {
            // await client.close();
        }
    },


    getFile: async function (_targetID) {
        await client.connect();
        try {
            const file = bucket.openDownloadStream(mongodb.ObjectId(_targetID));
            const buffers = [];
            file.on("data", chunk => buffers.push(chunk));
            file.once("end", () => {
                const buffer = Buffer.concat(buffers);
            });
            return buffer;        
        }
        finally {
            // await client.close();
        }
    },

    newConfigFile: async function (newDoc) {
        const result = await config.insertOne(newDoc);
        return result.insertedId.toHexString();
    },

    modSlideOrder: async function (idOrder) {
        const upDoc = {
            slideOrder: idOrder
        }
        const result =await config.updateOne({ name: "carousel_config" }, { $set: upDoc }, { upsert: true });
        return result.upsertedId.toHexString();
    },

    getSlideOrder: async function () {
        const result = await config.findOne({name: "carousel_config"});
        return result.slideOrder;
    }
};

// module.exports.checkUser('qwerty');
// module.exports.checkUser('asdaf','zxcv');
// const carousel = {
//     name: 'Carousel',
//     slideOrder: undefined,
//     slideCount: undefined,
//     lastModifiedDate: undefined,
//     lastModifiedBy: undefined
// }
// module.exports.newConfigFile(carousel);

