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

const
    dummyImage = fs.readFileSync("1.png"),
    dummySlides = [
        {
            id: "slide0",
            name: "Slide 0",
            type: "link",
            content: "https://webflow.com/made-in-webflow/website/Interactive-Sphere-Portfolio"
        },
        // {
        //     id: "slide1",
        //     name: "Slide 1",
        //     type: "image",
        //     content: fs.readFileSync("1.png")
        // },
        {
            id: "slide2",
            name: "Slide 2",
            type: "link",
            content: "https://www.fireeye.com/cyber-map/threat-map.html"
        }
    ],
    dummyOrder = [
        "slide0",
        "slide1",
        "slide2"
    ];

;(async () => {
    await app.whenReady();
    const connections = {};


    // Express API server

    api.use("/carousel", express.static(path.join(__dirname, "public/carousel")));
    api.use(express.raw());

    const server = api.listen(port, () => {
        console.log("Server running on port", port);
    });

    api.all("*", (req, res, next) => {
        console.log(req.path);
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    });

    api.post("/authenticate.json", async (req, res) => {
        console.log(req.body);
        const jsonData = JSON.parse(req.body);
        // let buffer = "";
        // req.on("data", chunk => buffer += chunk.toString());
        // req.on("close", async () => {
            try {
                const {username, password} = jsonData;
                await db.getUser(username, password);
                res
                    .status(200)
                    .send("Authenticated");
            } catch (e) {
                console.log("Failed to extract username and password.");
            }
        // });
    });

    api.get("/slides.json", (req, res) => {
        res
            .status(200)
            .send(JSON.stringify(dummySlides));
    });

    api.post("/slides.json", (req, res) => {
        for (const ws of Object.values(connections)) ws.send("update");
        req.on("data", chunk => console.log(chunk.toString()));
        req.on("close", () => console.log("Closed"));
        res
            .status(200)
            .send("Done");
    });

    api.get("/order.json", (req, res) => {
        res
            .status(200)
            .send(JSON.stringify(dummyOrder));
    });

    api.post("/order.json", (req, res) => {
        for (const ws of Object.values(connections)) ws.send("update");
        req.on("data", chunk => console.log(chunk.toString()));
        req.on("close", () => console.log("Closed"));
        res
            .status(200)
            .send("Done");
    });

    api.all("/image/*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    });

    api.get("/image/:image", async (req, res) => {
        res.setHeader("Content-Type", "application/octet-stream");
        const image = await db.getSlide(req.params.image);
        const buffers = [];
        image.on("data", chunk => buffers.push(chunk));
        image.once("end", () => {
            const buffer = Buffer.concat(buffers);
            res
                .status(200)
                .send(buffer);
        });
    });

    api.post("/image/:image", async (req, res) => {
        for (const ws of Object.values(connections)) ws.send("update");
        console.log(req.params.image);
        await db.modSlide(
            stream.Readable.from(Buffer.from(req.body)),
            req.query.name,
            "image",
            req.query.user,
            req.query.date,
            req.query.expiration || "",
            req.params.image
        );
    });

    api.post("/image/new", async (req, res) => {
        for (const ws of Object.values(connections)) ws.send("update");
        await db.modSlide(
            stream.Readable.from(Buffer.from(req.body)),
            req.query.name,
            "image",
            req.query.user,
            req.query.date,
            req.query.expiration
        );
    });

    api.ws("/autoupdate", (ws, req) => {
        console.log("Received websocket request");
        const id = uuid();
        connections[id] = ws;

        ws.on("message", msg => {
            console.log(msg);
        });

        ws.on("close", () => {
            console.log("Closed");
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
        urls: [/*'https://*.com/*', 'http://*.com/*', */"https://*/*"],
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
