import React, {useEffect, useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import {getImage, getSlides} from "./utility/api";
import './App.css';
import logo from './logo.svg';
import "./bootstrap.css";

export default function App() {
    const
        [slides, setSlides] = useState([]);
    async function updateSlides() {
        const slidesRes = await getSlides();
        const image = await getImage();
        const ab = new ArrayBuffer();
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
            interval={slide.interval || 500}
        >
            {{
                "link": <iframe
                    src={slide.content}
                />,
                "image": <img
                    src={`data:image/png;base64,${Buffer.from(slide.content, "base64")}`}
                />
            }[slide.type]}
        </Carousel.Item>)
        : <Carousel.Item>
            <h1
                style={{
                    textAlign: "center",
                    verticalAlign: "center"
                }}
            >No content available.</h1>
        </Carousel.Item>}
        <Carousel.Item
            interval={500}
        >
            <img
                className="d-block w-100"
                src={logo}
            />
        </Carousel.Item>
        <Carousel.Item
            interval={500}
        >
            <p>
                Hello world!
            </p>
        </Carousel.Item>
    </Carousel>;
}
