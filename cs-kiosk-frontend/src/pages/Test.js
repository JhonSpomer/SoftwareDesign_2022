/*
Last updated: 11/27/2022
Last worked on by: Jhon
Last added: buttons that hit endpoints. Preview image.

Hidden page to allow easy view of the slide preview, as well as test functionality to ping various end points as well as test middleware responsiveness via simple
buton clicks, rather than navigating all over the page.

-TODO-


*/
import Button from "@cloudscape-design/components/button";
import Preview from "./Preview";
import { Buffer } from 'buffer';
import React, { useState } from "react";



export default function Tests() {
    const
    [fileName, setFileName] = useState("file.txt"),
    [file, setFile] = useState(undefined);
    return <div>
        <center>
            <Button onClick={() => {
                console.log("All Function Test");
                Alltest();
            }}>Test all Functions</Button>
            <Button
                onClick={() => {
                    console.log("Database Ping test");
                    UserTest();
                }}>Test User Database</Button>
            <Button
                onClick={() => {
                    console.log("Image database test");
                    ImgTest();
                }}>Test Image database</Button>
            <Button
                onClick={() => {
                    console.log("Test connection middleware");
                    MiddlewareTest();
                }}>Test Connection</Button>
                <input
                type="file"
                //disabled={slide.slideType !== "image"}
                onChange={event => {
                    setFileName(event.target.files[0].name);
                    const fr = new FileReader();
                    fr.readAsArrayBuffer(event.target.files[0]);
                    fr.onload = () => setFile(fr.result);
                }}
            />
            <Preview
                width="80%"
                height="80%%"
            ></Preview></center>
    </div>

    async function Alltest() {

        console.log("All Test Starting..");
        //ping db
        UserTest();
        //ping img
        ImgTest();
        //ping middleware
        MiddlewareTest();
    };

    async function ImgTest() {
        console.log("Using base 64 creds of joe and 1234. Img test");
        let DummyCreds = "Joe" + ":" + "1234";
        var EncodedCreds = Buffer.from(DummyCreds);
        let base64Creds = EncodedCreds.toString('base64');

        const slide = {
            name: 'testslide',
            type: 'image'
        }
        
        //let Creds = sessionStorage.getItem("UserCreds");
                    const res = await fetch(`http://localhost:9000/image/new?type=image`, {
                        method: "POST",
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/octet-stream",
                            Authorization: `Basic ${base64Creds}`
                        },
                        body: file
                    });
                    const IDvalue = await res.text();
                    console.log(IDvalue);
                    if (res.ok) {
                        //let Creds = sessionStorage.getItem("UserCreds");
                        const res2 = await fetch(`http://localhost:9000/slide.json`, {
                            method: "POST",
                            mode: 'cors',
                            headers: {
                                "Content-Type": "text/plain",
                                Authorization: `Basic ${base64Creds}`
                            },
                            body: JSON.stringify({...slide, content: IDvalue})
                        });
                    }
                        

    };

    async function MiddlewareTest() {
        console.log("Testing middleware...")
        let DummyCreds = "Joe" + ":" + "1234";
        var EncodedCreds = Buffer.from(DummyCreds);
        let base64Creds = EncodedCreds.toString('base64');
        const res = fetch(`http://localhost:9000/MiddlewareTest`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: `Basic ${base64Creds}`
            }
        });

    }

    async function UserTest() {
        console.log("Using base 64 creds of Joe and 1234. User Test");
        let DummyCreds = "Joe" + ":" + "1234";
        var EncodedCreds = Buffer.from(DummyCreds);
        let base64Creds = EncodedCreds.toString('base64');

        let jsondata = JSON.stringify({ username: "Joe", password: "1234" });
        const res = await fetch('http://localhost:9000/authenticate.json', {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "text/plain",
                Authorization: `Basic ${base64Creds}`
            },
            body: jsondata
        });
        if (res.ok) {
            const value = await res.text();
            if (value === 'authenticated') {
                console.log("This shouldn't have authenticated. Test Failed");
            }
            else {
                console.log("Invalid credentials. Test Successful");
            }
        }

    };
}