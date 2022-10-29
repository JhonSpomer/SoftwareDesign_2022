const
    path = require("path"),
    express = require("express"),
    {app, BrowserWindow, protocol, session} = require("electron"),
    fs = require("fs"),
    db = require("./src/CRUD_functions"),
    {Binary} = require("mongodb"),
    stream = require("stream");

const
    port = 9000,
    api = express();

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
            content: "https://example.com"
        }
    ],
    dummyOrder = [
        "slide0",
        "slide1",
        "slide2"
    ];

;(async () => {
    await app.whenReady();


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

    api.get("/slides.json", (req, res) => {
        res
            .status(200)
            .send(JSON.stringify(dummySlides));
    });

    api.post("/slides.json", (req, res) => {
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
        await db.modSlide(
            stream.Readable.from(Buffer.from(req.body)),
            req.query.name,
            "image",
            req.query.user,
            req.query.date,
            req.query.expiration
        );
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
        urls: ['https://*.com/*', 'http://*.com/*'],
    };
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders['Referer'] = details.url;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    const win = new BrowserWindow({
        fullscreen: true
    });

    win.loadURL("http://localhost:9000/carousel");

    await db.updUser("admin", "newAdmin", "newPassword");
    await db.getUser("newAdmin", "newPassword");

    // Cleanup

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
        server.close();
    });
})();
