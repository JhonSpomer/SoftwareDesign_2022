/*
Last update: 11/11/2022 9:00 PM
Last worked on by: Jhon
Last added: connected to the server endpoints and backend , now checks for actual credentials.

login page and front end, hides nav bar, with error validation.  Now queries the database to check for valid credentials.

-TODO-
-add real disclaimer and user documentation.
--BUGS--
-Can skip login page by direct path in navbar.
*/

//imports
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
//import { Buffer } from 'buffer';
import "@cloudscape-design/global-styles/index.css"
import Applayout from "@cloudscape-design/components/app-layout";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Checkbox from "@cloudscape-design/components/checkbox";
import Admin from "./pages/Admin"
import Users from "./pages/Users"
import Tests from "./pages/Test"
import Preview from "./pages/Preview"
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";
import './App.css';
import EditSlide from './pages/Edit_Slide';
import UserEdit from './pages/UserEdit';
import { getImage } from './utility/utils';

//variables

function App() {
    const
        [userValue, setUserValue] = useState(),
        [passwordValue, setPasswordValue] = useState(""),
        [ErrorValue, setErrorValue] = useState(""),
        [activeHref, setActiveHref] = useState("/"),
        [navigationHide, setNavValue] = useState(true),
        [toolsHide, setToolsValue] = useState(true),
        navigate = useNavigate(),
        location = useLocation(),
        [checked, setChecked] = useState(false),
        [slides, setSlides] = useState([]),
        [files, setFiles] = useState({});

    useEffect(() => {
        // console.log(location.pathname)
        if (location.pathname === "/") {
            setNavValue(true);
            setToolsValue(true);
        }
    }, [location]);

    // async function loadOrder() {
    //     const newOrder = await fetch("http://localhost:9000/order.json", {
    //         method: "GET"
    //     });

    //     console.log(newOrder);
    //     const orderJson = await newOrder.json();
    //     console.log(orderJson);
    //     setOrder(orderJson);
    // }

    async function loadSlides() {
        const slidesRes = await fetch(new URL("/slides.json", "http://localhost:9000"), {
            method: "GET"
        });

        try {
            const newSlides = await slidesRes.json();
            // console.log("Fetched slides:", newSlides);
            const
                newFiles = [],
                ids = [];
            for (const slide of newSlides) {
                if (slide.slideType === "image") {
                    newFiles.push(getImage(slide.content));
                    ids.push(slide._id);
                }
                // else if (slide.slideType === "pdf") files[slide._id] = 
            }
            newFiles.splice(0, newFiles.length, ...(await Promise.all(newFiles)));
            for (const key in files) delete files[key];
            for (let i = 0; i < newFiles.length; i++) files[ids[i]] = newFiles[i];
            console.log(newFiles);
            setFiles({ ...files });
            setSlides(newSlides);
        } catch (error) {
            console.error("Encountered an error when attempting to fetch slides:", error);
        }
    }

    useEffect(() => {
        // loadOrder();
        loadSlides();
        const connection = new WebSocket(new URL("/autoupdate", "ws://localhost:9000"));

        async function onMessage(event) {
            // console.log(event.data);
            if (event.data === "update") {
                await loadSlides();
            }
        }

        function onClose() {
            connection.removeEventListener("message", onMessage);
            connection.removeEventListener("close", onClose);
        }

        connection.addEventListener("message", onMessage);
        connection.addEventListener("close", onClose);
        return () => {
            connection.close();
        };
    }, []);

    return (
        <Applayout
            navigationHide={navigationHide}
            toolsHide={toolsHide}
            navigation={
                <SideNavigation
                    activeHref={activeHref}
                    header={{ href: "/", text: "Admin Navigation" }}
                    onFollow={event => {
                        if (!event.detail.external) {
                            event.preventDefault();
                            setActiveHref(event.detail.href);
                            navigate(event.detail.href);
                            //setAdminPage(true);
                        }
                    }}
                    items={[
                        { type: "link", text: "Admin", href: "admin" },
                        { type: "link", text: "Preview", href: "preview" },
                        { type: "link", text: "Users", href: "users" },
                        { type: "link", text: "Login", href: "/" },
                        { type: "divider" },
                        {
                            //TODO
                            type: "link",
                            text: "User Guide",
                            href: "https://example.com",
                            external: true
                        }
                    ]}
                />
            }

            content={
                <Routes>
                    <Route path="*" element={<div>Oh no! You appear to have gotten lost. Please restart the system to get back to the login page. If this does not fix this problem. Please contact the system maintence team.</div>} />
                    <Route path="/test" element={<Tests />} />
                    <Route
                        path="/admin"
                        element={
                            <Admin
                                navigate={navigate}
                                setActiveHref={setActiveHref}
                                slides={slides}
                                files={files}
                            />
                        }
                    />
                    <Route path="/preview" element={<Preview />} />
                    <Route
                        path="/users"
                        element={
                            <Users
                                navigate={navigate}
                                setActiveHref={setActiveHref}
                            />
                        }
                    />
                    <Route
                        path="/UserEdit"
                        element={
                            <UserEdit
                                navigate={navigate}
                                setActiveHref={setActiveHref}
                            />
                        }
                    />

                    <Route
                        path="/edit/*"
                        element={
                            <EditSlide
                                navigate={navigate}
                                setActiveHref={setActiveHref}
                                slides={slides}
                            />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <div>
                                <Form
                                    actions={
                                        <SpaceBetween direction="horizontal" size="xs">
                                            <Button
                                                variant="primary"
                                                disabled={!checked}
                                                onClick={() => {
                                                    setUserValue("");
                                                    setPasswordValue("");
                                                    setActiveHref("admin");
                                                    query(userValue, passwordValue);
                                                    //sessionStorage.setItem(userValue);
                                                    //NavBarBool();
                                                }}
                                            >
                                                Submit
                                            </Button>
                                        </SpaceBetween>
                                    }
                                    header={
                                        <Header
                                            variant="h1"
                                        >
                                            Login
                                        </Header>
                                    }
                                >
                                    <FormField
                                        description="Username"
                                        label=""
                                        errorText={ErrorValue}
                                    >
                                        <Input
                                            value={userValue}
                                            onChange={event => setUserValue(event.detail.value)}
                                        />
                                    </FormField>
                                    <FormField
                                        description="Password"
                                        label=""
                                        errorText={ErrorValue}
                                    >
                                        <Input
                                            value={passwordValue}
                                            onChange={event => setPasswordValue(event.detail.value)
                                            }
                                        />
                                    </FormField>
                                </Form>
                                <Checkbox
                                    checked={checked}
                                    onChange={event =>
                                        setChecked(event.detail.checked)
                                    }
                                >
                                    YOU AGREE TO THE --TODO-- TERMS. GREAT THANKS
                                </Checkbox>
                            </div>
                        }
                    />
                </Routes>
            }
        />
    );

    async function query(usrName, pssWord) {
        //check if user credentials are in database

        let jsondata = JSON.stringify({ username: usrName, password: pssWord });
        console.log(jsondata);
        let Creds = usrName + ':' + pssWord;
        var EncodedCreds = Buffer.from(Creds);
        console.log(Creds);
        let base64Creds = EncodedCreds.toString('base64');

        //let StringCreds = String(base64Creds);

        window.sessionStorage.setItem("UserCreds", base64Creds);
        console.log(base64Creds);
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
                // console.log(value);
                setNavValue(false);
                navigate("/admin");
            }
        }
        // console.log("done");
    }
}

export default App;
