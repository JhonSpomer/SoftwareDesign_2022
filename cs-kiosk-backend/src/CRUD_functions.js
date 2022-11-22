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
            if (users.find({ "username": UN }).count() > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (users.find({ "username": UN }, { "password": PS }).count() === 1) {
                return true;
            }
            else if (users.find({ "username": UN }, { "password": PS }).count() > 1) {
                return "duplicate user records";
            }
            else {
                return false;
            }
        }
    },

    checkForSU: async function (_UN, _PS) {
        await client.connect();
        if (PS === undefined) {
            if (users.find({ "username": UN }).count() > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (users.find({ "username": UN }, { "password": PS }, { "superUser": "true" }).count() === 1, ) {
                return true;
            }
            else if (users.find({ "username": UN }, { "password": PS }, { "superUser": "true" }).count() > 1) {
                return "duplicate user records";
            }
            else {
                return false;
            }
        }

    },

    newUser: async function (_UN, PS) {
        await client.connect();
        try {
            if (module.exports.checkForUser(_UN)) {
                return "username taken";
            }
            // create a document to insert
            const doc =
            {
                username: _UN,
                password: _PS,
                superUser: "false"
            };
            const result = await users.insertOne(doc);
            //console.log(`A document was inserted with the _id: ${result.insertedId}`);
            return result.insertedId.toHexString();
        }
        finally {
            // await client.close();
        }
    },

    newSuperUser: async function (_UN, _PS) {
        await client.connect();
        try {
            if (module.exports.checkForSU(_UN)) {
                return "username taken";
            }
            // create a document to insert
            const doc =
            {
                username: UN,
                password: PS,
                superUser: "true"
            };
            const result = await users.insertOne(doc);
            //console.log(`A document was inserted with the _id: ${result.insertedId}`);
            return result.insertedId.toHexString();
        }
        finally {
            // await client.close();
        }
    },

    modUser: async function (_oldUN, _oldPS, _newUN, _newPS) {
        await client.connect();
        try {
            // let newUN = _newUN;
            // let oldUN = _oldUN;
            // let newPS = _newPS;
            // check if there is a user with the given credentials
            if (!module.exports.checkForUser)
            {
                console.log("User does not exist. Use NewUser to create a new user")
                return false;
            }
            let upDoc;
            if (module.exports.checkForUser(_newUN)) {
                return "username taken";
            }

            // create a document with just the fields to be updated
            if (_newUN === undefined && _newPS !== undefined) {
                upDoc = {password: _newPS};
            }
            
            if (_newPS === undefined && _newUN !== undefined) {
                upDoc = {password: _newUN};
            }

            else {
            
                upDoc =
                {
                    username: _newUN,
                    password: _newPS,
                };
            }
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
            user = users.findOne({ username: UN, password: PS }, { username: 1, password: 1 });
            user = await users.findOne({ username: UN, password: PS }, { username: 1, password: 1 });
        }
        finally {
            return user;
        }
    },
    modSlide: async function (_slideName, _slideType, _user, _date, _expDate, _content, _fileExt, targetID) {
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
                    fileExt: _fileExt
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
                    fileExt: _fileExt
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
            return bucket.delete(mongodb.ObjectId(_targetID));
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
        return slides.toArray();
    },

    newConfigFile: async function (newDoc) {
        const result = await config.insertOne(newDoc);
        return result.insertedId.toHexString();
    },
    modSlideOrder: async function (idOrder) {
        const upDoc = {
            slideOrder: idOrder
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
