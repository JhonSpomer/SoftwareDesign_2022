const {app, BrowserWindow} = require("electron");

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

await app.whenReady();

const win = new BrowserWindow({
    fullscreen: true
});

win.loadFile("./public/index.html");
