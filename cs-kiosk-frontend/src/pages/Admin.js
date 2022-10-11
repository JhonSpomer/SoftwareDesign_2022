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


export default function Admin() {

    //variables
    const [SlideName, setSlideName] = useState();
    const [ErrorValue, setErrorValue] = React.useState("");
    const slides = getSlides();

    return <div>
        <Form
            actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button
                        variant="primary"
                        onClick={() => {
                            deleteSlide();
                            setErrorValue("DELETE SLIDE");
                            console.log("delete!");
                        }}
                    >Remove Slide</Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            createSlide();
                            setErrorValue("CREATE SLIDE");
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
}

function deleteSlide() {

    //TODO navigate to slide delete


}

function createSlide() {

    //TODO navigate to slide create

}
