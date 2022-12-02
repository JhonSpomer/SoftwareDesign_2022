/*
Last update: 11/29/2022 9:00 PM
Last worked on by: Jhon
Last added: connected to the server endpoints and backend , now checks for actual credentials.

login page and front end, hides nav bar, with error validation.  Now queries the database to check for valid credentials.

-TODO-
-none

--BUGS--
-Can skip login page by direct path in navbar.
*/

//imports
import React, {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
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
import {useNavigate, useLocation, Route, Routes} from "react-router-dom";
import './App.css';
import EditSlide from './pages/EditSlide';
import UserEdit from './pages/UserEdit';
import {getImage} from './utility/utils';
import EditUser from "./pages/EditUser";
import Profile from './pages/Profile';

//variables

function App() {
    const
        navigate = useNavigate(),
        [userValue, setUserValue] = useState(),
        [passwordValue, setPasswordValue] = useState(""),
        [ErrorValue, setErrorValue] = useState(""),
        [activeHref, setActiveHref] = useState("/"),
        [navigationHide, setNavValue] = useState(true),
        [toolsHide, setToolsValue] = useState(true),
        location = useLocation(),
        [checked, setChecked] = useState(false),
        [slides, setSlides] = useState([]),
        [users, setUsers] = useState([]),
        [files, setFiles] = useState({});

    useEffect(() => {
        if (location.pathname === "/") {
            setNavValue(true);
            setToolsValue(true);
        }
    }, [location]);

    //Currently unused, Commented out but left for completness.
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
            const
                newFiles = [],
                ids = [];
            for (const slide of newSlides) {
                if (slide.slideType === "image") {
                    newFiles.push(getImage(slide.content));
                    ids.push(slide._id);
                }
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

    async function loadAUser() {

        
       // const user = await (await fetch(`http://localhost:9000/user.json?user=${testid}`))
    }

    async function loadUsers() {

        const usersRes = await fetch(new URL(`http://localhost:9000/users.json`), {
            method: "GET"
        });

        try {
            const newUsers = await usersRes.json();
            const
                newFiles = [],
                ids = [];
            newFiles.splice(0, newFiles.length, ...(await Promise.all(newFiles)));
            for (const key in files) delete files[key];
            for (let i = 0; i < newFiles.length; i++) files[ids[i]] = newFiles[i];
            console.log(newFiles);
            //setFiles({ ...files });
            setUsers(newUsers);
        } catch (error) {
            console.error("Encountered an error when attempting to fetch Users:", error);
        }
    }

    useEffect(() => {
        loadSlides();
        loadUsers();
        const connection = new WebSocket(new URL("/autoupdate", "ws://localhost:9000"));

        async function onMessage(event) {
            if (event.data === "update") {
                await loadSlides();
                await loadUsers();
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
                    header={{href: "/", text: "Admin Navigation"}}
                    onFollow={event => {
                        if (!event.detail.external) {
                            event.preventDefault();
                            setActiveHref(event.detail.href);
                            navigate(event.detail.href);
                        }
                    }}
                    items={[
                        {type: "link", text: "User Settings", href: "profile"},
                        {type: "link", text: "Admin", href: "admin"},
                        {type: "link", text: "Preview", href: "preview"},
                        {type: "link", text: "Users", href: "users"},
                        {type: "link", text: "Login", href: "/"},
                        {type: "divider"},
                        {
                            //We don't have a documentation website to link to at this time; thus, I've commented this segment out as to not misslead users. -Jhon
                            //TODO
                            //type: "link",
                            //text: "documentation",
                           // href: "https://example.com",
                            //external: true
                        }
                    ]}
                />
            }

            content={
                <Routes>
                    <Route path="*" element={<div>Oh no! You appear to have gotten lost. Please restart the system to get back to the login page. If this does not fix this problem. Please contact the system maintence team.</div>} />
                    <Route path="/test" element={<Tests />} />
                    <Route path="/profile" element={<Profile />} />
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
                        path="/test"
                        element={
                            <Tests
                                navigate={navigate}
                                setActiveHref={setActiveHref}
                            />
                        }

                    />
                    <Route
                        path="/edit/user/*"
                        element={
                            <UserEdit
                                navigate={navigate}
                                setActiveHref={setActiveHref}
                            />
                        }
                    />

                    <Route
                        path="/edit/slide/*"
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
                                    You agree to the guidelines set out by the CMU Computer Science department;
                                     In addition, you agree to abide by FERPA guidelines for all content on this kiosk.
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


        window.sessionStorage.setItem("UserCreds", base64Creds);
        console.log(base64Creds);
        const res = await fetch('http://localhost:9000/authenticate.json', {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "text/plain",
                "Authorization": `Basic ${base64Creds}`
            },
            body: jsondata
        });
        if (res.ok) {
            const value = await res.text();
            if (value === 'authenticated') {
                setNavValue(false);
                navigate("/admin");
            }
        }
    }
}

export default App;
