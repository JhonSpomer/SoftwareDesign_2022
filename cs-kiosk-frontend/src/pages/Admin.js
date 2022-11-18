/*
Last modified: 11/11/2022
Last worked on by: Jhon and Matt
last added: Connecting to backend and reworking of add slide button

This page should allow user to upload files provided and place them in the carousel and database. As well as display cards representing each slide in the 
carosuel. 

--NOTE--
Admin_Old is no longer needed, but it is still in the github repo for reference.

-TODO-
-Del and edit

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
    const [ErrorValue, setErrorValue] = useState("");
    const slides = getSlides();
    const which = false;

    return <Cards
        ariaLabels={{
            itemSelectionLabel: (e, t) => `select ${t.name}`,
            selectionGroupLabel: "Item selection"
        }}
        cardDefinition={{
            header: item => (
                <Link fontSize="heading-m">{item.slideName}</Link>
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
                            }}
                        >
                            Edit slide
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("del");
                                // let json_test = JSON.stringify({ name: "test", type: "testtype", content: "testcontent", Id:  });
                                const res = fetch(`http://localhost:9000/delete.json?id=${item._id}`, {
                                    method: "GET",
                                    mode: "cors"
                                });
                               // console.log(json_test);
                                //working on hitting the new del.json endpoint added in main.js. Even though it currently doesnt del anything.-Jhon
                                // setItems(items.filter(i => i.name !== item.name));
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
        items={props.slides}
        loadingText="Loading resources"
        empty={
            <Box textAlign="center" color="inherit">
                <b>
                    No slides
                </b>
                <Box
                    padding={{ bottom: "s" }}
                    variant="p"
                    color="inherit"
                >
                    No slides to display.
                </Box>
                <Button
                    onClick={async event => {
                        event.preventDefault();
                        const href = `/edit/new`;
                        props.setActiveHref(href);
                        props.navigate(href);
                    }}
                >
                    Create slide
                </Button>
            </Box>
        }
        header={
            <Header
                actions={<Button
                    onClick={async event => {
                        event.preventDefault();
                        const href = `/edit/new`;
                        props.setActiveHref(href);
                        props.navigate(href);
                        // setItems(
                        //     [...items, {
                        //         _id:items.length,
                        //         name: "slide " + (items.length+1),
                        //         alt:"dfeault",
                        //         description: "This is default description for slide " + (items.length+1)
                        //     }]
                        // )
                    }}>
                    Create Slide
                </Button>
                }
            >
                Current Slides
            </Header>
        }
    />;
}

function deleteSlide() {

    //TODO navigate to slide delete


}

function createSlide() {

    //TODO navigate to slide create

}
