/*
Last modified: 10/27/2022
Last worked on by: Jhon
last added: Modification to href to allow edit slide to navigate to preview.
This page should allow user to upload files provided and place them in the carousel and database. 
--NOTE--
Admin_Old is no longer needed, but it is still in the github repo for reference.
-TODO-
--BUGS--
-If user reloads page, the navbar dissapears.
-Can bypass login by directly entering navigation path
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

export default function Admin(props) {

    //variables
    const [SlideName, setSlideName] = useState();
    const [ErrorValue, setErrorValue] = React.useState("");
    const [items, setItems] = useState([
        {
            _id: "0",
            name: "Item 1",
            alt: "First",
            description: "This is the first item"
        },
        {
            _id: "1",
            name: "Item 2",
            alt: "Second",
            description: "This is the second item"
        },
        {
            _id: "2",
            name: "Item 3",
            alt: "Third",
            description: "This is the third item"
        },
        {
            _id: "3",
            name: "Item 4",
            alt: "Fourth",
            description: "This is the fourth item"
        },
        {
            _id: "4",
            name: "Item 5",
            alt: "Fifth",
            description: "This is the fifth item"
        },
        {
            _id: "5",
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
                        content: item => <SpaceBetween
                            direction="horizontal"
                            size="m"
                        >
                            <Button
                                onClick={async event => {
                                    event.preventDefault();
                                    const href = `/edit/${item._id}`;
                                    props.setActiveHref(href);
                                    props.navigate(href);
                                    // console.log("add");
                                    // const data = await (await fetch('http://localhost:9000/slides.json', {
                                    //     mode: 'cors'
                                    // })).json();
                                    // console.log(data);
                                }
                                }
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
                            </Button>
                        </SpaceBetween>
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
            header={<Header
                actions={<Button
                    onClick={() => {
                        setItems(
                            [{
                                name: "defaultslide",
                                alt: "default",
                                description: "default"
                            }]);
                    }}>Create Slide
                </Button>}
            >
                Example Cards
            </Header>}
        />;
}

function deleteSlide() {

    //TODO navigate to slide delete


}

function createSlide() {

    //TODO navigate to slide create

}
