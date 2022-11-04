const endpoint = "10.0.2.15";

export async function getSlides() {
    const res = await fetch(new URL("/slides.json", `http://${endpoint}:9000`), {
        method: "GET"
    });
    return await res.json();
}

export async function getImage(image) {
    const res = await fetch(new URL(`/image/${image}`, `http://${endpoint}:9000`), {
        method: "GET"
    });
    console.log(res);
    return await res.arrayBuffer();
}

export async function getAllSlideData() {
    const slides = await getSlides();
    for (const slide of slides) if (slide.type === "image" || slide.type === "pdf") slide.content = await getImage(slide.content);
    return slides;
}

export function autoUpdateLoop(cb) {
    const connection = new WebSocket(new URL("/autoupdate", `ws://${endpoint}:9000`));
    console.log("Opening websocket");

    function onOpen() {
        connection.send("Hello world!");
    }

    async function onMessage(event) {
        console.log(event.data);
        if (event.data === "update") {
            console.log("Updating slides");
            await cb(await getAllSlideData());
        }
    }

    function onClose() {
        connection.removeEventListener("open", onOpen);
        connection.removeEventListener("message", onMessage);
        connection.removeEventListener("close", onClose);
    }

    connection.addEventListener("open", onOpen);
    connection.addEventListener("message", onMessage);
    connection.addEventListener("close", onClose);
}
