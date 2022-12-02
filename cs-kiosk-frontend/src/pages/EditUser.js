/*
Last updated: 11/29/2022
Last worked on by: Jhon
Last added: documentation. Since matt still hates adding documentation for future maintence of this project. 

Edit user page for the user documentation. Should only be accessed by a super user , since only a super user can edit, delete, or add new users. 

-TODO-

-BUGS-

*/


import React, {useState, useEffect} from "react";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";

export default function EditUser(props) {
    const
        [error, setError] = useState(undefined),
        [passwordError, setPasswordError] = useState(undefined),
        [username, setUsername] = useState(""),
        [password, setPassword] = useState(""),
        [passwordConfirm, setPasswordConfirm] = useState("");

    return <form onSubmit={event => event.preventDefault()}>
        <Form
            header={<Header
                variant="h1"
            >
                Enter new username and password
            </Header>}
            actions={<SpaceBetween
                direction="horizontal"
                size="xs"
            >
                <Button
                    variant="normal"
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={async event => {
                        event.preventDefault();
                        if (password !== passwordConfirm) {
                            setPasswordError("Passwords do not match. Please type matching passwords.");
                            return;
                        }
                        const credentials = window.sessionStorage.getItem("UserCreds");
                        const res = await fetch("http://localhost:9000/user.json", {
                            method: "POST",
                            mode: "cors",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Basic ${credentials}`
                            }
                        });
                        if (res.ok) {
                            props.setActiveHref("/profile");
                            props.navigate("/profile");
                            return;
                        } else {
                            setError("A server error occurred. Please try again later.");
                            return;
                        }
                    }}
                >
                    Submit
                </Button>
            </SpaceBetween>}
        >
            <FormField
                label="Username"
            >
                <Input
                    type="text"
                    value={username}
                    onChange={event => setUsername(event.detail.value)}
                />
            </FormField>
            <FormField
                label="Password"
            >
                <Input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.detail.value)}
                />
            </FormField>
            <FormField
                label="Re-type password"
                errorText={passwordError}
            >
                <Input
                    type="password"
                    value={passwordConfirm}
                    onChange={event => setPasswordConfirm(event.detail.value)}
                />
            </FormField>
        </Form>
    </form>;
}
