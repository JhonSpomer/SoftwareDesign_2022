const
    path = require("path"),
    express = require("express"),
    expressWs = require("express-ws"),
    {app, BrowserWindow, protocol, session} = require("electron"),
    fs = require("fs"),
    db = require("./src/CRUD_functions"),
    {Binary} = require("mongodb"),
    stream = require("stream"),
    uuid = require("uuid").v4;

const
    port = 9000,
    api = express();

expressWs(api);

;(async () => {
    await app.whenReady();
    const connections = {};

    function updateAllConnections() {
        for (const ws of Object.values(connections)) ws.send("update");
    }

    function authenticate(req) {
        if (req.headers[""]) ;
        return true;
    }


    // Express API server

    api.use("/carousel", express.static(path.join(__dirname, "public/carousel")));
    // api.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000, type: "application/octet-stream"}));
    api.use(express.raw({limit: "4mb", type: "application/octet-stream"}));
    api.use(express.raw());

    const server = api.listen(port, () => {
        console.log("Server running on port", port);
    });

    api.all("*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    });

    api.post("/authenticate.json", async (req, res) => {
        let buffer = "";
        res.setHeader("Access-Control-Allow-Headers", Authorization);
        res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000/');
        req.on("data", chunk => buffer += chunk.toString());
        req.on("close", async () => {
            try {
                const {username, password} = JSON.parse(buffer);
                await db.getUser(username, password);
                res
                    .status(200)
                    .send("authenticated");
            } catch (e) {
                console.log("Failed to extract username and password.");
            }
        });
    });

    api.get("/slides.json", async (req, res) => {
        const
            order = await db.getSlideOrder();
        //     slides = [];
        // console.log(order);
        // for (const id of order) slides.push(await db.getSlide(id));
        // console.log(slides);
        res
            .status(200)
            .send(JSON.stringify(await Promise.all(order.map(id => db.getSlide(id)))));
    });

    // api.post("/slides.json", (req, res) => {
    //     req.on("data", chunk => console.log(chunk.toString()));
    //     req.on("close", () => {
    //         console.log("Closed");
    //         for (const ws of Object.values(connections)) ws.send("update");
    //     });
    //     res
    //         .status(200)
    //         .send("Done");
    // });

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

    api.post("/slide.json", (req, res) => {
        let buffer = "";
        const index = req.query.index || Infinity;
        req.on("data", chunk => buffer += chunk.toString());
        req.on("close", async () => {
            const slide = JSON.parse(buffer);
            const id = await db.modSlide(
                slide.name,
                slide.type,
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
        });
    });

    //===============================================================================================================
    //
    //
    //
    //
    //
    //adding del endpoint here. or trying anyways. ~Jhon
    api.get("/delete.json", async (req, res) => {
    
        res.setHeader("Access-Control-Allow-Headers", "*");
        console.log("Reached delete midpoint");
        //want to redo slide order once deleted. 
        // let buffer = "";
        // req.on("data", chunk => buffer += chunk.toString());
        // req.on("close", async () => {
        try {
            // const {Id} = JSON.parse(buffer);
            const order = await db.getSlideOrder();
            await db.modSlideOrder(order.filter(i => i != req.query.id));
            console.log(req.query.id);
            await db.delSlide(req.query.id);
            updateAllConnections();
            res          
                .status(200)
                .send("deleting slide with id " + req.query.id);
                console.log("deleting " + req.query.id);
        } catch (e) {
            console.log("Failed to delete");
        }
        // });
        //console.log("Got here");
    });



    api.get("/order.json", async (req, res) => {
        const order = await db.getSlideOrder();
        res.setHeader("Content-Type", "application/json");
        res
            .status(200)
            .send(JSON.stringify(order));
    });

    api.post("/order.json", (req, res) => {
        let buffer = "";
        req.on("data", chunk => buffer += chunk.toString());
        req.on("close", async () => {
            await db.modSlideOrder(JSON.parse(buffer));
            updateAllConnections();
        });
        res
            .status(200)
            .send("Done");
    });

    api.all("/image/*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    });

    api.post("/image/new", async (req, res) => {
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
    });

    api.get("/image/:id", async (req, res) => {
        const image = await db.getFile(req.params.id);
        res
            .status(200)
            .send(image.image);
    });

    api.post("/image/:id", async (req, res) => {
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
    });


    api.ws("/autoupdate", (ws, req) => {
        const id = uuid();
        connections[id] = ws;

        ws.on("message", msg => {});

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
        callback({cancel: false, requestHeaders: details.requestHeaders});
    });
    session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
        const csp = Object.keys(details.responseHeaders).find(h => h.toLowerCase() === "content-security-policy") || "content-security-policy";
        details.responseHeaders[csp] = "frame-ancestors *;";
        callback({cancel: false, responseHeaders: details.responseHeaders});
    });

    const win = new BrowserWindow({
        fullscreen: true
    });

    win.loadURL("http://localhost:9000/carousel");

    // await db.updUser("admin", "newAdmin", "newPassword");
    // console.log(await db.getUser("newAdmin", "newPassword"));

    // Cleanup

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
        server.close();
    });
})();
