const
    path = require("path"),
    express = require("express"),
    expressWs = require("express-ws"),
    { app, BrowserWindow, protocol, session } = require("electron"),
    fs = require("fs"),
    db = require("./src/CRUD_functions"),
    SUdb = require("./src/SUCRUD_functions"),
    { Binary } = require("mongodb"),
    stream = require("stream"),
    uuid = require("uuid").v4;

const
    port = 9000,
    api = express();

expressWs(api);

; (async () => {
    await app.whenReady();
    const connections = {};

    function updateAllConnections() {
        for (const ws of Object.values(connections)) ws.send("update");
    }

    // function authenticate(req) {
    //     console.log(req.get('Authorization'));
    //     console.log(req.headers);

    //     let auth = (new Buffer.from(req.headers.Authorization.split(' ')[1], 'base64')).toString().split(':');
    //     return true;//db.checkForUser(auth[0], auth[1]);
    // }


    // Express API server

    api.use("/carousel", express.static(path.join(__dirname, "public/carousel")));
    // api.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000, type: "application/octet-stream"}));
    api.use(express.raw({ limit: "4mb", type: "application/octet-stream" }));
    api.use(express.raw());

    const server = api.listen(port, () => {
        console.log("Server running on port", port);
    });

    api.all("*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", req.get("Origin"));
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        next();
    });

    async function requireAuthentication(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", req.get("Origin"));
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        let auth = req.get("Authorization");
        console.log("Auth:", auth);
        if (typeof auth === "string") {
            try {
                let [username, password] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
                console.log(username, password);
                if (await db.checkForUser(username, password)) {
                    req.username = username;
                    req.password = password;
                    next();
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        }
        console.log("Got here too???");
        // res
        //     .status(401)
        //     .send("authentication failed");
        return next();
    }

    async function requireSuperUserAuthentication(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", req.get("Origin"));
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        let auth = req.get("Authorization");
        if (typeof auth === "string") {
            try {
                const [username, password] = (new Buffer.from(auth.split(" ")[1], "base64")).toString().split(":");
                if (await SUdb.checkForSU(username, password)) {
                    req.username = username;
                    req.password = password;
                    next();
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        }
        // res
        //     .status(401)
        //     .send("authentication failed");
        return next();
    }

    api.post("/authenticate.json", async (req, res) => {
        let buffer = "";
        req.on("data", chunk => buffer += chunk.toString());
        req.on("close", async () => {
            try {
                const {username, password} = JSON.parse(buffer);
                console.log(username, password);
                let authRes = await db.checkForUser(username, password);
                if (authRes === true) {
                    res
                        .status(200)
                        .send("authenticated");
                } else if (authRes === false) {
                    res
                        .status(401)
                        .send("authentication failed");
                } else {
                    res
                        .status(401)
                        .send(authRes);
                }
            } catch (e) {
                console.log("Failed to extract username and password.");
                res
                    .status(401)
                    .send("not authenticated");
            }
        });
    });

    api.get("/slides.json", async (req, res) => {
        const
            order = await db.getSlideOrder();
        res
            .status(200)
            .send(JSON.stringify(await Promise.all(order.map(id => db.getSlide(id)))));
    });

    api.get("/slide.json", async (req, res) => {
        const slide = await db.getSlide(req.params.slide);
        if (slide) {
            res
                .status(200)
                .send(JSON.stringify(slide));
        } else {
            res
                .status(404)
                .send("nonexistant");
        }
    });

    api.get("/users.json", async (req, res) => {
        const user = await SUdb.getAllUsers();
        console.log(user);
        //console.log(user);
        if (user) {
            res.setHeader("Content-Type", "application/json");
            res
                .status(200)
                .send(JSON.stringify(user));
        } else {
            res
                .status(404)
                .send("nonexistant");
        }
    });

    api.post("/slide.json", requireAuthentication, (req, res) => {
        if (req.username && req.password) {
            let buffer = "";
            const index = req.query.index || Infinity;
            req.on("data", chunk => buffer += chunk.toString());
            req.once("close", async () => {
                const slide = JSON.parse(buffer);
                const id = await db.modSlide(
                    slide.slideName,
                    slide.slideType,
                    undefined,
                    undefined,
                    undefined,
                    slide.content,
                    undefined,
                    req.query.id
                );
                const order = await db.getSlideOrder();
                if (!req.query.id) order.splice(index, 0, id);
                await db.modSlideOrder(order);
                updateAllConnections();
                res
                    .status(200)
                    .send(id);
                return;
            });
        } else {
            res
                .status(401)
                .send("not authorized");
        }
    });

    api.post("/user.json", requireAuthentication, (req, res) => {
        console.log("Got here");
        if (req.username && req.password) {
            let buffer = "";
            req.on("data", chunk => buffer += chunk.toString());
            req.once("close", async () => {
                try {
                    const {oldUsername, oldPassword, newUsername, newPassword} = JSON.parse(buffer);
                    console.log("Retrieved username and password:", oldUsername, oldPassword, newUsername, newPassword);
                    if (req.username !== oldUsername || req.password !== oldPassword) {
                        res
                            .status(400)
                            .send("bad request");
                        return;
                    }
                    await db.modUser(
                        oldUsername,
                        oldPassword,
                        newUsername,
                        newPassword
                    );
                    res
                        .status(200)
                        .send("modified user");
                    return;
                } catch (error) {
                    console.error(error);
                    res
                        .status(400)
                        .send("bad request");
                    return;
                }
            });
        } else {
            res
                .status(401)
                .send("not authorized");
        }
    });


    api.get("/MiddlewareTest", async (req, res) => {
        console.log("Reached The middleware test endpoint: Test Successful.");

        res
            .status(200)
            .send("MiddlewareTest successful");
    });

    // api.all("/delete/*", requireAuthentication);

    //===============================================================================================================
    //
    //
    //
    //
    //
    //adding del endpoint here. or trying anyways. ~Jhon
    api.get("/delete/slide.json", requireAuthentication, async (req, res) => {
        if (req.username && req.password) {
            console.log("Reached delete midpoint");
            try {
                const order = await db.getSlideOrder();
                await db.modSlideOrder(order.filter(i => i != req.query.id));
                console.log(req.query.id);
                await db.delSlide(req.query.id);
                await db.delFile(req.query.id);
                updateAllConnections();
                res
                    .status(200)
                    .send("deleting slide with id " + req.query.id);
                console.log("deleting " + req.query.id);
            } catch (e) {
                console.log("Failed to delete");
            }
        }
        res
            .status(401)
            .send("not authorized");
    });

    api.get("/delete/user.json", requireSuperUserAuthentication, async (req, res) => {
    });

    api.get("/order.json", async (req, res) => {
        const order = await db.getSlideOrder();
        res.setHeader("Content-Type", "application/json");
        res
            .status(200)
            .send(JSON.stringify(order));
    });

    api.post("/order.json", requireAuthentication, (req, res) => {
        if (req.username && req.password) {
            let buffer = "";
            req.on("data", chunk => buffer += chunk.toString());
            req.on("close", async () => {
                await db.modSlideOrder(JSON.parse(buffer));
                updateAllConnections();
            });
            res
                .status(200)
                .send("Done");
        }
        res
            .status(401)
            .send("not authorized");
    });

    api.post("/image/new", requireAuthentication, async (req, res) => {
        if (req.username && req.password) {
            if (req.query.type !== "png" && req.query.type !== "jpg") {
                res
                    .status(401)
                    .send("Bad image type");
                return;
            }
            if (req.query.type === "jpg") req.query.type = "jpeg";
            const id = await db.modFile(
                stream.Readable.from(Buffer.from(req.body)),
                req.query.type,
                req.query.user,
                req.query.date,
                req.query.expiration
            );
            updateAllConnections();
            res
                .status(200)
                .send(id);
        }
        res
            .status(401)
            .send("not authorized");
    });

    api.get("/image/:id", async (req, res) => {
        const image = await db.getFile(req.params.id);
        res
            .status(200)
            .send(image.image);
    });

    api.post("/image/:id", requireAuthentication, async (req, res) => {
        if (req.username && req.password) {
            const id = await db.modFile(
                stream.Readable.from(Buffer.from(req.body)),
                req.query.name,
                "image",
                req.query.user,
                req.query.date,
                req.query.exp || "",
                req.query.ext,
                req.params.id
            );
            updateAllConnections();
            res
                .status(200)
                .send(id);
        }
        res
            .status(401)
            .send("not authorized");
    });


    api.ws("/autoupdate", (ws, req) => {
        const id = uuid();
        connections[id] = ws;

        ws.on("message", msg => { });

        ws.on("close", () => {
            delete connections[id];
        });
    });


    // Electron kiosk display

    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //     callback({
    //         responseHeaders: {
    //             ...details.responseHeaders,
    //             "Content-Security-Policy": ["default-src * 'unsafe-inline'; frame-ancestors *"]
    //         }
    //     });
    // });

    const filter = {
        urls: ["https://*/*"],
    };
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        const url = new URL(details.referrer || details.url);
        details.requestHeaders["Origin"] = url.origin;
        details.requestHeaders["Referer"] = details.url;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
    session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
        const csp = Object.keys(details.responseHeaders).find(h => h.toLowerCase() === "content-security-policy") || "content-security-policy";
        details.responseHeaders[csp] = "frame-ancestors *;";
        callback({ cancel: false, responseHeaders: details.responseHeaders });
    });

    const win = new BrowserWindow({
        fullscreen: true
    });

    win.loadURL("http://localhost:9000/carousel");

    // await SUdb.updUser("admin", "newAdmin", "newPassword");
    // console.log(await db.getUser("newAdmin", "newPassword"));

    // Cleanup

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
        server.close();
    });
})();
