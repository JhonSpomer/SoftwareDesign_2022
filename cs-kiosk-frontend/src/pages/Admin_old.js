/*
Last modified: 10/11/2022
Last worked on by: Jhon
last added: radio box toggleing.
This page should allow user to upload files provided and place them in the carousel and database. User can toggle to the input field they desire.

--NOTE--
Currently I have this file renamed as Admin_old. I am unsure if this design is what we will stick with at this time, but its staying on the repo in case
we end up needing to go with it.

-TODO-
drag and drop.
make upload buttons look nice. Hide dissabled input fields.
finish delete and upload functions.
connect to db.
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
                                cancel();
                            }}
                        >cancel</Button>

                        <Button
                            variant="primary"
                            onClick={() => {
                                submit();
                            }}
                        >Submit</Button>
                    </SpaceBetween>
                }
                header={<Header variant="h1">Form header</Header>}
            >
                <FormField
                    description="Check the box for your input type"
                    label=""

                >
                    <RadioGroup
                        onChange={({ detail }) => setValue(detail.value)}
                        value={value}
                        items={[
                            { value: true, label: "URL upload" },
                            { value: false, label: "PDF/JPG/PNG" }
                        ]}
                    />
                </FormField>
                <FormField
                    label="File upload 1"

                >
                    {/* This works better. -Matthew */}
                    <input
                        type="file"
                        value={fileValue0}
                        disabled={value}
                        onChange={event => {
                            console.log(event.target.files[0]);
                            console.log("Look at me!");
                            setFileValue0(event.target.files[0]);
                        }}
                    />
                </FormField>
                <FormField
                    label="URL upload 1"

                >
                    <Input
                        value={urlValue1}
                        onChange={event => setUrlValue1(event.detail.value)}
                        disabled={!value}
                    />
                </FormField>
                <FormField
                    label="File upload 2"
                >
                            {
                        value
                        ? <input type="file" id="fileupload2" name="fileupload2" disabled="disabled" />
                        : <input type="file" id="fileupload2" name="fileupload2" />
                    }
                </FormField>
                <FormField
                    label="URL upload 2"

                >
                    <Input
                        value={urlValue2}
                        onChange={event => setUrlValue2(event.detail.value)}
                        disabled={!value}
                    />
                </FormField>
                <FormField
                    label="File upload 3"
                >
                            {
                        value
                        ? <input type="file" id="fileupload3" name="fileupload3" disabled="disabled" />
                        : <input type="file" id="fileupload3" name="fileupload3" />
                    }
                </FormField>
                <FormField
                    label="URL upload 3"

                >
                    <Input
                        value={urlValue3}
                        onChange={event => setUrlValue3(event.detail.value)}
                        disabled={!value}
                    />

                </FormField>
                
            </Form>


        </form>


    </div>
}

function cancel() {

    //TODO

}

function submit() {

    //TODO
}
