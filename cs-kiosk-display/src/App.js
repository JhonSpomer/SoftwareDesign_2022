import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {getImage, getSlides, getAllSlideData, autoUpdateLoop} from "./utility/api";
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
        >
            {{
                "link": () => <iframe
                    src={slide.content}
                    width={"2000vw"}
                    height={"1000vh"}
                    // csp={`frame-ancestors ${slide.content};`}
                />,
                "image": () => <img
                    src={`data:image/jpg;base64, ${window.btoa(
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
