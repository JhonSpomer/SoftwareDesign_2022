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
    return {
        image: await res.arrayBuffer(),
        type: res.headers.get("Content-Type")
    };
}

export async function getAllSlideData() {
    const slides = await getSlides();
    for (const slide of slides) if (slide.slideType === "image") {
        const imageData = await getImage(slide.content);
        slide.content = imageData.image;
        slide.mimeType = imageData.type;
    }
    return slides;
}

export function autoUpdateLoop(cb) {
    const connection = new WebSocket(new URL("/autoupdate", `ws://${endpoint}:9000`));
    console.log("Opening websocket");

    async function onMessage(event) {
        if (event.data === "update") {
            await cb(await getAllSlideData());
        }
    }

    function onClose() {
        connection.removeEventListener("message", onMessage);
        connection.removeEventListener("close", onClose);
    }

    connection.addEventListener("message", onMessage);
    connection.addEventListener("close", onClose);
}
