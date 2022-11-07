export function ImgFromArrayBuffer(props) {
    let
        arrayBuffer = props.arrayBuffer,
        mimeType = props.MIMEtype;
    delete props["arrayBuffer"];
    delete props["mimeType"];
    return <img
        src={window.URL.createObjectURL(new Blob([new Uint8Array(arrayBuffer)], {type: mimeType}))}
        {...props}
    />;
}
