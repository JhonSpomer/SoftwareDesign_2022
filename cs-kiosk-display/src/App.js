import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {getImage, getSlides, getAllSlideData, autoUpdateLoop} from "./utility/api";
import {ImgFromArrayBuffer} from "./utility/utils";
import './App.css';
import "./bootstrap.css";

export default function App() {
    const
        [slides, setSlides] = useState([]);
    async function updateSlides() {
        autoUpdateLoop(setSlides);
        setSlides(await getAllSlideData());
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
            style={{
                width: "100%",
                height: "100%"
            }}
        >
            {{
                "link": () => <iframe
                    src={slide.content}
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                />,
                "image": () => <ImgFromArrayBuffer
                    arrayBuffer={slide.content}
                    mimeType={slide.mimeType || "image/jpeg"}
                />
            }[slide.slideType]()}
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
