/*
Last update: 11/29/2022 
Last worked on by: Jhon. Because Matt hates leaving documentation for future students maintening of this project.
Last added: This now exists!

Profile page displays username and obscured password. Assuming the user properly arrived and was authenticated in the user database.

-TODO-

--BUGS--
*/


import React, {useState} from "react";
import Container from "@cloudscape-design/components/container";
import ContentLayout from "@cloudscape-design/components/content-layout";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";

export default function Profile(props) {
    const
        [alert, setAlert] = useState(undefined),
        credentials = sessionStorage.getItem("UserCreds");
    let username = "", password = "";
    if (!credentials) setAlert(<Alert
        type="error"
        header="You are not logged in."
    >
        Reload the page or navigate to the login tab to login.
    </Alert>);
    else [username, password] = window.atob(credentials).split(":");

    useState(() => {
        [username, password] = window.atob(credentials).split(":");
    }, []);

    return <ContentLayout
        header={<Header
            variant="h1"
        >
            User Profile
        </Header>}
    >
        {alert || <SpaceBetween
            direction="vertical"
            size="xs"
        >
            <Container
                header={<Header
                    variant="h2"
                >
                    User Credentials
                </Header>}
            >
                <FormField
                    label="Username"
                >
                    {username}
                </FormField>
                <FormField
                    label="Password"
                >
                    {password.slice(0, 1) + (new Array(password.length - 2)).fill("●", 0, password.length - 2).join("") + password.slice(-1)}
                </FormField>
                <Button
                    variant="normal"
                    onClick={async event => {
                        event.preventDefault();
                        const href = `/edit/user/${username}`;
                        props.setActiveHref(href);
                        props.navigate(href);
                    }}
                >
                    Change
                </Button>
            </Container>
        </SpaceBetween>}
    </ContentLayout>;
}
