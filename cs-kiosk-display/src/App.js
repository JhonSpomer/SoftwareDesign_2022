import React, {useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import './App.css';
import logo from './logo.svg';
import "./bootstrap.css";

export default function App() {
    const
        [index, setIndex] = useState(0);

    setInterval(() => setIndex((index + 1) % 2), 2000);

    return <Carousel
        controls={false}
        indicators={false}
        activeIndex={index}
        onSelect={i => setIndex(i)}
    >
        <Carousel.Item>
            <img
                className="d-block w-100"
                src={logo}
            />
        </Carousel.Item>
        <Carousel.Item>
            <p>
                Hello world!
            </p>
        </Carousel.Item>
    </Carousel>;
}
