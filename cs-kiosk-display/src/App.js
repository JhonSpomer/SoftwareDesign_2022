import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {getImage, getSlides, getAllSlideData, autoUpdateLoop} from "./utility/api";
import './App.css';
import "./bootstrap.css";

export default function App() {
    const
        [slides, setSlides] = useState([]);
    async function updateSlides() {
        const slidesRes = await getSlides();
        const image = await getImage("635b2c87c1078d59803396c8");
        await autoUpdateLoop(() => {});
        const slidesGotten = await getAllSlideData();
        console.log(slidesGotten);
        console.log("Image:", image);
        slidesRes.push({
            id: "testimage",
            name: "Test Image",
            type: "image",
            content: <img
                src={`data:image/png;base64, ${window.btoa(
                    (new Uint8Array(image))
                    .reduce((prev, cur) => prev + String.fromCharCode(cur), "")
                )}`}
            />
        });
        setSlides(slidesRes);
        console.log("Slides set");
    }

    useEffect(() => {
        if (!slides.length) updateSlides();
    }, []);

    return <Carousel
        controls={false}
        indicators={false}
        pause={false}
    >
        {slides.length
        ? slides.map(slide => <Carousel.Item
            interval={slide.interval || 8000}
        >
            {{
                "link": () => <iframe
                    src={slide.content}
                    width={"2000vw"}
                    height={"1000vh"}
                    // csp={`frame-ancestors ${slide.content};`}
                />,
                "image": () => slide.content
            }[slide.type]()}
        </Carousel.Item>)
        : <Carousel.Item>
            <h1
                style={{
                    textAlign: "center",
                    verticalAlign: "center"
                }}
            >No content available.</h1>
        </Carousel.Item>}
    </Carousel>;
}
