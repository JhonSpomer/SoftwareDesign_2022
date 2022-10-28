import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {getImage, getSlides} from "./utility/api";
import './App.css';
import "./bootstrap.css";

export default function App() {
    const
        [slides, setSlides] = useState([]);
    async function updateSlides() {
        const slidesRes = await getSlides();
        const image = await getImage();
        console.log("Image:", image);
        slides.push({
            id: "testimage",
            name: "Test Image",
            type: "image",
            content: image
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
            interval={slide.interval || 1000}
        >
            {{
                "link": () => <embed
                    src={slide.content}
                    width={"2000vw"}
                    height={"1000vh"}
                />,
                "image": () => <img
                    // src={slide.content}
                    src={`data:image/png;base64, ${window.btoa(
                        (new Uint8Array(slide.content.data))
                        .reduce((prev, cur) => prev + String.fromCharCode(cur), "")
                    )}`}
                />
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
