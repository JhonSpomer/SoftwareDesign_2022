const
    path = require("path"),
    express = require("express"),
    {app, BrowserWindow, protocol} = require("electron");

const
    port = 9000,
    api = express();

;(async () => {
    await app.whenReady();

    // Express API server

    api.use("/carousel", express.static(path.join(__dirname, "public/carousel")));

    const server = api.listen(port, () => {
        console.log("Server running on port", port);
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
