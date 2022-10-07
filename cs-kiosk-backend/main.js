const
    path = require("path"),
    express = require("express"),
    {app, BrowserWindow, protocol} = require("electron"),
    fs = require("fs"),
    Binary = require("mongodb").Binary;

const
    port = 9000,
    api = express();

const
    dummySlides = [
        {
            id: "slide0",
            type: "link",
            content: "https://example.com"
        },
        {
            id: "slide1",
            type: "image",
            content: fs.readFileSync("1.png")
        },
        {
            id: "slide2",
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

    const server = api.listen(port, () => {
        console.log("Server running on port", port);
    });

    api.get("/slides.json", (req, res) => {
        res.status(200).send(JSON.stringify(dummySlides));
    });

    api.post("/slides.json", (req, res) => {
        req.on("data", chunk => console.log(chunk.toString()));
        req.on("close", () => console.log("Closed"));
        res.status(200).send("Done");
    });

    api.get("/order.json", (req, res) => {
        res.status(200).send(JSON.stringify(dummyOrder));
    });

    api.post("/order.json", (req, res) => {
        req.on("data", chunk => console.log(chunk.toString()));
        req.on("close", () => console.log("Closed"));
        res.status(200).send("Done");
    });

    // Electron kiosk display
    
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
