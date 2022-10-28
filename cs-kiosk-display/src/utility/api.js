const endpoint = "10.0.2.15";

export async function getSlides() {
    const res = await fetch(new URL("/slides.json", `http://${endpoint}:9000`), {
        method: "GET"
    });
    return await res.json();
}

export async function getImage(image) {
    const res = await fetch(new URL("/image/1.png", `http://${endpoint}:9000/${image}`), {
        method: "GET"
    });
    console.log(res);
    return await res.arrayBuffer();
}
