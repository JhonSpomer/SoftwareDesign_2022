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
    checkForUser: async function (UN, PS) {
        await client.connect();
        if (PS === undefined) {
            if (await users.find({"username": UN}).count() > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (await users.find({ "username": UN, "password": PS }).count() === 1) {
                return true;
            }
            else if (await users.find({"username": UN, "password": PS}).count() > 1) {
                return "duplicate user records, please contact database admin.";
            }
            else {
                return false;
            }
        }
    },

    modUser: async function (_oldUN, _oldPS, _newUN, _newPS) {
        await client.connect();
        try {
            // check if there is a user with the given credentials
            if (!module.exports.checkForUser(_oldUN, _oldPS))
            {
                console.log("User does not exist. Use NewUser to create a new user")
                return false;
            }

            if (module.exports.checkForUser(_newUN)) {
                console.log("User already exists")
                return false;
            }

            // create a document with just the fields to be updated
            const upDoc =
            {
                username: _newUN,
                password: _newPS,
            };
            //update document with given username
            //upsert set to true - will insert given document if it does not already exixst
            const result = await users.updateOne({ username: _oldUN, password: _oldPS }, { $set: upDoc }, { upsert: false });
            //console.log(`A document was updated with the _id: ${result.upsertedId}`);
            return result.upsertedId.toHexString();
        }
        finally {
            // await client.close();
        }
    },

    modSlide: async function (_slideName, _slideType, _user, _date, _expDate, _content, _fileExt, targetID, _approved = false) {
        await client.connect();
        try {
            //if no existing document ID is provided, create a new slide record.
            if (!targetID) {
                // slide metadata document
                const slideDoc =
                {
                    slideName: _slideName,
                    slideType: _slideType,
                    slideOwner: _user,
                    lastModifiedBy: _user,
                    expiration_date: _expDate,
                    content: _content,
                    fileExt: _fileExt,
                    approved: _approved
                };
                const result = await slides.insertOne(slideDoc, { upsert: true });
                // console.log(`A document was created with the _id: ${result.insertedId}`);
                return result.insertedId.toHexString();
            }
            else {
                // slide metadata document
                const slideDoc =
                {
                    slideName: _slideName,
                    slideType: _slideType,
                    // an existing document should already have an owner.
                    lastModifiedBy: _user,
                    expiration_date: _expDate,
                    content: _content,
                    fileExt: _fileExt,
                    approved: _approved
                };
                const result = await slides.updateOne({ _id: mongodb.ObjectId(targetID) }, { $set: slideDoc }, { upsert: true });
                // console.log(`A document was updated with the _id: ${result.upsertedId}`);
                return result.upsertedId.toHexString();
            }
            //console.log(`A document was updated with the _id: ${result.upsertedId}`);

        }
        finally {
            // await client.close();
        }
    },
    delSlide: async function (_targetID) {
        await client.connect();
        try {
            //delete document with given uID
            //const result = 
            await slides.deleteOne({ _id: mongodb.ObjectId(_targetID) });
            //console.log(`${result.deletedId} document(s) deleted.`);
        }
        finally {
            // await client.close();
        }
    },
    getSlide: async function (targetID) {
        await client.connect();
        let slide;
        try {
            slide = await slides.findOne({ _id: mongodb.ObjectId(targetID) }, {
                slideName: 1,
                slideType: 1,
                slideOwner: 1,
                lastModifiedBy: 1,
                lastModifiedDate: 1,
                expiration_date: 1,
                content: 1,
                fileExt: 1,
                _id: 1
            });
        }
        finally {
            return slide;
        }
    },
    delFile: async function (_targetID) {
        await client.connect();
        try {
            return await bucket.delete(mongodb.ObjectId(_targetID));
        }
        finally {
            // await client.close();
        }
    },
    modFile: async function (_RS, _name, _type, _user, _date, _expDate, _fileExt, targetID) {
        await client.connect();
        try {
            if (targetID === undefined) {
                const stream = bucket.openUploadStream(_name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate, fileExt: _fileExt } });
                const result = await _RS.pipe(stream);
                //console.log('A slide file was added with the id: ${result.uploadID._id}');
                return stream.id.toHexString();
            }
            else {
                // //delete old slide
                await module.exports.delSlide(mongodb.ObjectId(targetID));
                //upload new slide
                const stream = bucket.openUploadStreamWithId(mongodb.ObjectId(targetID), _name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate, fileExt: _fileExt } });
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
            const document = await bucket.find({ _id: mongodb.ObjectId(_targetID) }).toArray();
            return await new Promise((resolve, reject) => {
                const file = bucket.openDownloadStream(mongodb.ObjectId(_targetID));
                const buffers = [];
                file.on("data", chunk => buffers.push(chunk));
                file.once("end", () => {
                    resolve({
                        image: Buffer.concat(buffers),
                        type: document[0].metadata.type
                    });
                });
                file.once("error", reject);
            });
        }
        finally {
            // await client.close();
        }
    },

    getAllSlides: async function () {
        await client.connect();
        const rawObj = await slides.find();
        rawObj.rewind();
        return rawObj.toArray();
    },

    modSlideOrder: async function (_idOrder) {
        const upDoc = {
            slideOrder: _idOrder
        };
        const result = await config.updateOne({ name: "carousel_config" }, { $set: upDoc }, { upsert: true });
        // return result.upsertedId.toHexString();
    },
    getSlideOrder: async function () {
        const result = await config.findOne({ name: "carousel_config" });
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
