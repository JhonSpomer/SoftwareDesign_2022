/*
Last modified: 9/29/2022
Last worked on by: Jhon
last added: submit and cancel functions.
This page should allow user to upload files provided and place them in the carousel and database.

-TODO-
drag and drop.
make upload buttons look nice.
finish delete and upload functions.
connect to db.
*/

//import React from 'react' //nothing here yet. admin page
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import React, { useEffect, useState } from 'react';
import RadioGroup from "@cloudscape-design/components/radio-group";
//import FileUpload from "@cloudscape-design/components/file-upload";
import Input from "@cloudscape-design/components/input";


export default function Admin() {

    //variables
    const [urlValue1, setUrlValue1] = useState();
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
                    label="radio button 1"

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
                    {
                        value
                        ? <input type="file" id="fileupload1" name="fileupload1" disabled="disabled" />
                        : <input type="file" id="fileupload1" name="fileupload1" />
                    }
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