const
    path = require("path"),
    express = require("express"),
    {app, BrowserWindow, protocol, session} = require("electron"),
    fs = require("fs"),
    db = require("./src/CRUD_functions");

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
        {
            id: "slide1",
            name: "Slide 1",
            type: "image",
            content: fs.readFileSync("1.png")
        },
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

    api.get("/image/:image(\\w+).((png|jpg))", (req, res) => {
        console.log(`Getting image: ${req.path}`);
        console.log(req.params.image);
        res
            .status(200)
            .send(dummyImage);
    });

    api.post("/image/:image(\\w+).((png|jpg))", (req, res) => {
        console.log(req.params.image);
        console.log(req.body);
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

    // Cleanup

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
        server.close();
    });
})();
