/*
Last updated: 11/29/2022
Last worked on by: Jhon
Last added: documentation. Since matt still hates adding documentation for future maintence of this project. 

Edit user page for the user documentation. Should only be accessed by a super user , since only a super user can edit, delete, or add new users. 

-TODO-

-BUGS-

*/


import React, {useState, useEffect} from "react";
import {Buffer} from 'buffer';
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Alert from "@cloudscape-design/components/alert";

export default function EditUser(props) {
    let oldUsername = "", oldPassword = "";
    const
        [error, setError] = useState(undefined),
        credentials = window.sessionStorage.getItem("UserCreds");
    if (!credentials) setError(<Alert
        type="error"
        header="You are not logged in."
    >
        Reload the page or navigate to the login tab to login.
    </Alert>);
    else [oldUsername, oldPassword] = window.atob(credentials).split(":");
    const
        [passwordError, setPasswordError] = useState(undefined),
        [newUsername, setNewUsername] = useState(oldUsername),
        [newPassword, setNewPassword] = useState(""),
        [passwordConfirm, setPasswordConfirm] = useState("");

    return <ContentLayout
        header={<Header
            variant="h1"
        >
            Edit Username and Password
        </Header>}
    >
        <Container
            header={<Header
                variant="h2"
            >
                User Credentials
            </Header>}
        >
            <form onSubmit={event => event.preventDefault()}>
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
                                if (newPassword !== passwordConfirm) {
                                    setPasswordError("Passwords do not match. Please type matching passwords.");
                                    return;
                                }
                                const res = await fetch("http://localhost:9000/user.json", {
                                    method: "POST",
                                    mode: "cors",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Basic ${credentials}`
                                    },
                                    body: JSON.stringify({
                                        oldUsername, oldPassword,
                                        newUsername, newPassword
                                    })
                                });
                                console.log(res);
                                if (res.ok) {
                                    let Creds = newUsername + ':' + newPassword;
                                    var encodedCreds = Buffer.from(Creds);
                                    console.log(Creds);
                                    let base64Creds = encodedCreds.toString('base64');
                                    window.sessionStorage.setItem("UserCreds", base64Creds);
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
                            value={newUsername}
                            onChange={event => setNewUsername(event.detail.value)}
                        />
                    </FormField>
                    <FormField
                        label="Password"
                    >
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={event => setNewPassword(event.detail.value)}
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
            </form>
        </Container>
    </ContentLayout>;
}
