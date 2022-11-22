import React, {useState, useEffect} from "react";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";

export default function EditUser(props) {
    const
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
                    onClick={event => {
                        event.preventDefault();
                        if (password !== passwordConfirm) {
                            setPasswordError("Passwords do not match. Please type matching passwords.");
                            return;
                        }
                        props.navigate("/users");
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
