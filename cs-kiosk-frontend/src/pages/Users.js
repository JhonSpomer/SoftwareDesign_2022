/*
Last updated: 11/29/2022
Last worked on by: Jhon
Last added: Documentation. 


This page displays users who are currently active in the user database, a super user can edit, add, and delete credentials, a normal user cannot.

-TODO-
-link array to user database. Remove dummy arrays.

--BUGS--

*/

import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import React, {useEffect, useState} from 'react';
import Input from "@cloudscape-design/components/input";
import {getSlides} from "../utility/retrieve_slides";
import Cards from "@cloudscape-design/components/cards";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import ContentLayout from "@cloudscape-design/components/content-layout";


export default function Users(props) {
    useEffect(() => {
        console.log(props.users);
    }, []);
    return <ContentLayout
        header={<Header
            variant="h1"
        >
            User List
        </Header>}
    >
        <Cards
            ariaLabels={{
                itemSelectionLabel: (e, t) => `select ${t.name}`,
                selectionGroupLabel: "Item selection"
            }}
            cardDefinition={{
                header: item => (
                    <Link fontSize="heading-m">{item.username}</Link>
                ),
                sections: [
                    {
                        id: "actions",
                        header: "Actions",
                        content: item => <SpaceBetween
                            direction="horizontal"
                            size="m"
                        >
                            <Button
                                onClick={async event => {
                                    event.preventDefault();
                                    const href = `/edit/user/${item._id}`;
                                    props.setActiveHref(href);
                                    props.navigate(href);
                                }}
                            >
                                Edit user
                            </Button>
                            <Button
                                onClick={() => {
                                    console.log("del");
                                    let creds = sessionStorage.getItem("UserCreds");
                                    console.log(creds);
                                    const res = fetch(`http://localhost:9000/delete/slide.json?id=${item._id}`, {
                                        method: "GET",
                                        mode: "cors",
                                        headers: {
                                            "Authorization": `Basic ${creds}`
                                        }
                                    });
                                }}
                            >
                                Delete user
                            </Button>
                        </SpaceBetween>,
                        width: "50"
                    }
                ]
            }}
            cardsPerRow={[
                { cards: 1 },
                { minWidth: 500, cards: 1 }
            ]}
            items={props.users}
            loadingText="Loading resources"
            empty={
                <Box textAlign="center" color="inherit">
                    <b>
                        No users
                    </b>
                    <Box
                        padding={{ bottom: "s" }}
                        variant="p"
                        color="inherit"
                    >
                        No users to display.
                    </Box>
                    <Button
                        onClick={async event => {
                            event.preventDefault();
                            const href = `/edit/user/new`;
                            props.setActiveHref(href);
                            props.navigate(href);
                        }}
                    >
                        Create user
                    </Button>
                </Box>
            }
            header={
                <Header
                    actions={<Button
                        onClick={async event => {
                            event.preventDefault();
                            const href = `/edit/user/new`;
                            props.setActiveHref(href);
                            let stored = sessionStorage.getItem("UserCreds");
                            console.log(stored);
                            props.navigate(href);
                        }}
                    >
                        Create User
                    </Button>}
                >
                    Current User Accounts
                </Header>
            }
        />
    </ContentLayout>;
}
