const
    mongodb = require("mongodb"),
    fs = require('fs');

const buffer = fs.readFileSync("../.mongodb.auth");
const uri = buffer.toString();

const client = new mongodb.MongoClient(uri);
const database = client.db("BulletinDisplay");
const users = database.collection("users");
const bucket = new mongodb.GridFSBucket(database, { bucketName: 'newSlides' });

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
        }
        finally {
            // await client.close();
        }
    },

    updUser: async function (oldUN, newUN, newPS) {
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
            console.log(`A document was updated with the _id: ${result.upsertedId}`);
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
            console.log(`${result.deletedCount} document(s) deleted.`);
        }
        finally {
            // await client.close();
        }
    },

    getUser: async function (UN, PS) {
        await client.connect();
        //how are we handling checking users against the user DB?
        //return raw results from DB
        var user;
        try 
        {
            user = users.findOne({ username:UN, password:PS }, {username:1, password:1});
        }
        finally 
        {
            return user;
        }
 
    },

    checkUser: async function (UN,PS)
    {
        /*
        For user creation:
        -check for record with username
        -return T/F

        For login:
        -search for record that with matching UN and PS
        -return T/F
        */
        var user;
        try 
        {
            //findOne() returns null if user does not exist
            if (PS === undefined)
            {
                user = await users.findOne({ username:UN },{username:1});
                if (user===null)
                {
                    return false;
                }
                else if (user.username === UN)
                {
                    return true;
                }
                else 
                {
                    console.log('findOne() has returned and unexpected value: ', user)
                }

            }
            else
            {
                user = await users.findOne({ username:UN, password:PS },{username:1, password:1});
                if (user===null)
                {
                    return false;
                }
                else if (user.username === UN && user.password === PS)
                {
                    return true;
                }
                else 
                {
                    console.log('findOne() has returned and unexpected value: ', user)
                }
            }
        }
        finally 
        {
            return user;
        }
    },

    delSlide: async function (_targetID) {
        await client.connect();
        try {
            return bucket.delete(mongodb.ObjectId(_targetID));
        }
        finally {
            // await client.close();
        }
    },


    modSlide: async function (_RS, _name, _type, _user, _date, _expDate, targetID) {
        await client.connect();
        try {
            if (targetID === undefined) {
                const result = _RS.pipe(bucket.openUploadStream(_name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate } }));
                //console.log('A slide file was added with the id: ${result.uploadID._id}');
            }
            else {
                // //delete old slide
                // await delSlide(targetID);
                //upload new slide
                const result = _RS.pipe(bucket.openUploadStreamWithId(targetID, _name, { metadata: { type: _type, owner: _user, lastModifiedBy: _user, lastModifiedDate: _date, expDate: _expDate } }));
                //console.log('A slide file was added with the _id: ${result.insertedId}');
            }
        }
        finally {
            // await client.close();
        }
    },


    getSlide: async function (_targetID) {
        await client.connect();
        try {
            return bucket.openDownloadStream(mongodb.ObjectId(_targetID));

            /*
            const image = await db.getSlide(req.params.image);
            const buffers = [];
            image.on("data", chunk => buffers.push(chunk));
            image.once("end", () => {
            const buffer = Buffer.concat(buffers);
            res
                .status(200)
                .send(buffer);
            });
            */
        }
        finally {
            // await client.close();
        }
    }
};

// module.exports.checkUser('qwerty');
// module.exports.checkUser('asdaf','zxcv');

