/*
Last modified: 10/11/2022
Last worked on by: Jhon
last added: radio box toggleing.
This page should allow user to upload files provided and place them in the carousel and database. 

--NOTE--
This is an attempt to make the front page look cleaner. With the site directing the user to the correct page based on the button choice.

-TODO-

*/

import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import React, { useEffect, useState } from 'react';
import RadioGroup from "@cloudscape-design/components/radio-group";
import Input from "@cloudscape-design/components/input";
import { getSlides } from "../utility/retrieve_slides";
import Cards from "@cloudscape-design/components/cards";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";

export default function Admin() {

    //variables
    const [SlideName, setSlideName] = useState();
    const [ErrorValue, setErrorValue] = React.useState("");
    const [items, setItems] = useState([
        {
            name: "Item 1",
            alt: "First",
            description: "This is the first item"

        },
        {
            name: "Item 2",
            alt: "Second",
            description: "This is the second item"

        },
        {
            name: "Item 3",
            alt: "Third",
            description: "This is the third item"

        },
        {
            name: "Item 4",
            alt: "Fourth",
            description: "This is the fourth item"

        },
        {
            name: "Item 5",
            alt: "Fifth",
            description: "This is the fifth item"

        },
        {
            name: "Item 6",
            alt: "Sixth",
            description: "This is the sixth item"

        }
    ]);
    const slides = getSlides();
    const which = false;

    return which
    ? <div>
        <Form
            actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button
                        variant="primary"
                        onClick={() => {
                            //deleteSlide();
                            //setErrorValue("DELETE SLIDE");
                            console.log("delete!");
                        }}
                    >Remove Slide</Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                           //createSlide();
                            //setErrorValue("CREATE SLIDE");
                            console.log("add!");
                        }}
                    >Add Slide</Button>
                </SpaceBetween>

            }
            header={<Header variant="h1">Please select your choice</Header>}

        >
            <FormField
                description="Enter the slide name"
                label=""
                errorText={ErrorValue}
            >
                <Input
                    value={SlideName}
                    onChange={event => setSlideName(event.detail.value)}
                />
            </FormField>
        </Form>
    </div>

    : <Cards
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
                    content: item => <Button
                        onClick={() => console.log("Hi!")}
                    >
                        Click me
                    </Button>
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
                <Button>Create resource</Button>
            </Box>
        }
        header={<Header>Example Cards</Header>}
    />;
}

function deleteSlide() {

    //TODO navigate to slide delete


}

function createSlide() {

    //TODO navigate to slide create

}
