/*
Admin page. Last modified 9/29/2022
Jhon

This page should allow user to upload files provided and place them in the carousel and database.

-TODO-
drag and drop.
file navigation.
*/
import React from 'react' //nothing here yet. admin page
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
//import FileUpload from "@cloudscape-design/components/file-upload";
import Input from "@cloudscape-design/components/input";

export default function Admin() {

    //variables
    const [FileInputValue, setFileInputValue] = React.useState("");
    const [FileInputValue2, setFileInputValue2] = React.useState("");
    const [FileInputValue3, setFileInputValue3] = React.useState("");
    const [ErrorValue, setErrorValue] = React.useState("");
    return <div>
        
        <form onSubmit={e => e.preventDefault()}>

            
            <Form
                actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button formAction="none" variant="link">
                            Cancel
                        </Button>
                        <Button variant="primary">Submit</Button>
                    </SpaceBetween>
                }
                header={<Header variant="h1">Form header</Header>}
            >
                <FormField
                    description="This is object 1"
                    label="Box 1"
                >
                    <Input
                        value={FileInputValue}
                        onChange={event =>
                            setFileInputValue(event.detail.value)
                        }
                    />
                </FormField>
                <FormField
                    description="This is object 2"
                    label="Box 2"
                >
                    <Input
                        value={FileInputValue2}
                        onChange={event =>
                            setFileInputValue2(event.detail.value)
                        }
                    />
                </FormField>
                <FormField
                    description="This is object 3"
                    label="Box 3"
                >
                    <Input
                        value={FileInputValue3}
                        onChange={event =>
                            setFileInputValue3(event.detail.value)
                        }
                    />
                </FormField>
            </Form>

            
        </form>
    </div>
}