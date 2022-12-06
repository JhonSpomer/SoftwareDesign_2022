const endpoint = "10.0.2.15";

export function ImgFromArrayBuffer(props) {
    let
        arrayBuffer = props.arrayBuffer,
        mimeType = props.mimeType,
        innerProps = {...props};
    delete innerProps["arrayBuffer"];
    delete innerProps["mimeType"];
    return <img
        src={window.URL.createObjectURL(new Blob([new Uint8Array(arrayBuffer)], {type: mimeType}))}
        {...innerProps}
    />;
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
