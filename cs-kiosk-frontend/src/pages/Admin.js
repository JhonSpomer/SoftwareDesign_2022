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


export default function Admin() {

    //variables
    const [urlValue1, setUrlValue1] = useState();
    const [fileValue0, setFileValue0] = useState();
    const [urlValue2, setUrlValue2] = useState();
    const [urlValue3, setUrlValue3] = useState();
    const [value, setValue] = React.useState(false);
    const [ErrorValue, setErrorValue] = React.useState("");
    return <div>



        <form onSubmit={e => e.preventDefault()}>

            <Form 
             actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button
                        variant="primary"
                        onClick={() => {
                            deleteSlide();
                        }}
                    >Remove Slide</Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            createSlide();
                        }}
                    >Add Slide</Button>
                </SpaceBetween>
            }
            header={<Header variant="h1">Please select your choice</Header>}

            ></Form>
        </form>
    </div>
}

function deleteSlide() {

    //TODO

}

function addSlide() {

    //TODO
}
