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
                return "duplicate user records, please contact database administrator";
            }
            else {
                return false;
            }
        }

    },

    newUser: async function (_UN, _PS, _SU = false) {
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
                superUser: _SU
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
            // check if there is a user with the given credentials
            if (!module.exports.checkForUser)
            {
                console.log("User does not exist. Use NewUser to create a new user")
                return false;
            }

            if (module.exports.checkForUser(_newUN)) {
                return "username taken";
            }

            // create a document with just the fields to be updated
            let upDoc;
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

    changeUserStatus: async function(_UN, _PS, _SU = false)
    {
        await client.connect();
        const upDoc = {superUser:_SU};
        const result = await users.updateOne({ username: _oldUN, password: _oldPS }, { $set: upDoc }, { upsert: false });
        return result.upsertedId.toHexString();
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

    newConfigFile: async function (newDoc) {
        const result = await config.insertOne(newDoc);
        return result.insertedId.toHexString();
    },




//discrete function for super user CRUD operations will be left here in case standard users
//need to be given the ability to modify their credentials.

    // newSuperUser: async function (_UN, _PS) {
    //     await client.connect();
    //     try {
    //         if (module.exports.checkForSU(_UN)) {
    //             return "username taken";
    //         }
    //         // create a document to insert
    //         const doc =
    //         {
    //             username: UN,
    //             password: PS,
    //             superUser: "true"
    //         };
    //         const result = await users.insertOne(doc);
    //         //console.log(`A document was inserted with the _id: ${result.insertedId}`);
    //         return result.insertedId.toHexString();
    //     }
    //     finally {
    //         // await client.close();
    //     }
    // },

    // modSU: async function (_oldUN, _oldPS, _newUN, _newPS) {
    //     await client.connect();
    //     try {
    //         // check if there is a user with the given credentials
    //         if (!module.exports.checkForUser)
    //         {
    //             console.log("User does not exist. Use NewUser to create a new user")
    //             return false;
    //         }
    //         let upDoc;
    //         if (module.exports.checkForUser(_newUN)) {
    //             return "username taken";
    //         }

    //         // create a document with just the fields to be updated
    //         if (_newUN === undefined && _newPS !== undefined) {
    //             upDoc = {password: _newPS};
    //         }
            
    //         if (_newPS === undefined && _newUN !== undefined) {
    //             upDoc = {password: _newUN};
    //         }

    //         else {
            
    //             upDoc =
    //             {
    //                 username: _newUN,
    //                 password: _newPS,
    //             };
    //         }
    //         //update document with given username
    //         //upsert set to true - will insert given document if it does not already exixst
    //         const result = await users.updateOne({ username: _oldUN, password: _oldPS }, { $set: upDoc }, { upsert: false });
    //         //console.log(`A document was updated with the _id: ${result.upsertedId}`);
    //         return result.upsertedId.toHexString();
    //     }
    //     finally {
    //         // await client.close();
    //     }
    // },

}