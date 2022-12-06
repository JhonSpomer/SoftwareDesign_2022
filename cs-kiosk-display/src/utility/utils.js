export function ImgFromArrayBuffer(props) {
    let
        arrayBuffer = props.arrayBuffer,
        mimeType = props.mimeType,
        style = props.style;
    delete props["arrayBuffer"];
    delete props["mimeType"];
    delete props["style"];
    // return <img
    //     src={window.URL.createObjectURL(new Blob([new Uint8Array(arrayBuffer)], {type: mimeType}))}
    //     {...props}
    // />;
    return <div
        style={{
            background: `url(${window.URL.createObjectURL(new Blob([new Uint8Array(arrayBuffer)], {type: mimeType}))}) 0% 0% / 100% 100% no-repeat`,
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "100% 100%",
            width: "100vw",
            height: "100vh",
            ...style
        }}
        {...props}
    />;
}
