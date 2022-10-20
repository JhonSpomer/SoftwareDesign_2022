/*
Last updated: 10/17/2022
Last worked on by: Jhon
Last added: cards, started adding functionality for add user. 
-TODO-
-Add button
-Navigates to user page?
*/

import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import React, { useEffect, useState } from 'react';
import Input from "@cloudscape-design/components/input";
import { getSlides } from "../utility/retrieve_slides";
import Cards from "@cloudscape-design/components/cards";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";


export default function Users() {
    //variables
    const [SlideName, setSlideName] = useState();
    const [items, setItems] = useState([
        {
            name: "User 1",
            alt: "First",
            description: "This is the first item"

        },
        {
            name: "User 2",
            alt: "Second",
            description: "This is the second item"

        },
        {
            name: "User 3",
            alt: "Third",
            description: "This is the third item"

        },
        {
            name: "User 4",
            alt: "Fourth",
            description: "This is the fourth item"

        },
        {
            name: "User 5",
            alt: "Fifth",
            description: "This is the fifth item"

        },
        {
            name: "User 6",
            alt: "Sixth",
            description: "This is the sixth item"

        }
    ]);
    const slides = getSlides();
    const which = false;


    return <Cards
        ariaLabels={{
            itemSelectionLabel: (e, t) => `select ${t.name}`,
            selectionGroupLabel: "Item selection"
        }}
        cardDefinition={{
            header: item => (
                <Link fontSize="heading-m">{item.name}</Link>
            ),
            sections: [
                {
                    id: "description",
                    header: "Description",
                    content: item => item.description
                },
                {
                    id: "type",
                    header: "Type",
                    content: item => <SpaceBetween
                        direction="horizontal"
                        size="m"
                    >

                        <Button
                            onClick={() => console.log("add")}
                        >
                            Edit slide
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("del");
                                setItems(items.filter(i => i.name !== item.name));
                            }}
                        >
                            Delete slide
                        </Button></SpaceBetween>
                },
                {
                    id: "size",
                    header: "Size",
                    content: item => item.size
                }
            ]
        }}
        cardsPerRow={[
            { cards: 1 },
            { minWidth: 500, cards: 1 }
        ]}
        items={items}
        loadingText="Loading resources"
        empty={
            <Box textAlign="center" color="inherit">
                <b>No resources</b>
                <Box
                    padding={{ bottom: "s" }}
                    variant="p"
                    color="inherit"
                >
                    No resources to display.
                </Box>
                <Button
                    onClick={() => {
                        //create();
                        setItems(
                            [{
                                name: "testitem",
                                alt: "test",
                                description: "test"
                            }]);
                    }}>Create User

                </Button>
            </Box>
        }

        header={<Header
            actions={<Button
                onClick={() => {
                    setItems(
                        [{
                            name: "testitem",
                            alt: "test",
                            description: "test"
                        }]);
                }}>Create User

            </Button>}>Current Users</Header>}


    />;



}


function create() {


    //TODO navigate to slide create

}
