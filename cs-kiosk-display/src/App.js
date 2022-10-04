import React, {useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import './App.css';
import logo from './logo.svg';
import "./bootstrap.css";

export default function App() {
    return <Carousel
        controls={false}
        indicators={false}
        pause={false}
    >
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
