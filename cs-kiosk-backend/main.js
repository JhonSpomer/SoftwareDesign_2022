const path = require("path");
const {app, BrowserWindow, protocol} = require("electron");

;(async () => {
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
    
    await app.whenReady();

    protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url;
        if (url.includes(__dirname)) return callback(url.replace("file:///", ""));
        callback(path.normalize(`${__dirname}/public/${url.slice(7)}`).replace("file:///", ""));
    });
    
    const win = new BrowserWindow({
        fullscreen: true
    });
    win.loadFile("public/index.html");
})();
