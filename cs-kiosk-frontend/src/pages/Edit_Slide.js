/*
Last updated: 10/20/2022
Last updated by: Jhon and Matt
Last change: Modified to send image to server.


--BUGS--


--TODO--


*/


import React, { useState } from "react";
import Wizard from "@cloudscape-design/components/wizard";
import RadioGroup from "@cloudscape-design/components/radio-group";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import Link from "@cloudscape-design/components/link";
import Container from "@cloudscape-design/components/container";


export default function EditSlide() {
    const
        [activeStepIndex, setActiveStepIndex] = useState(0),
        [slideType, setSlideType] = useState("none"),
        [slideError, setSlideError] = useState(undefined);
    const [fileValue0, setFileValue0] = useState();
    const [value, setValue] = React.useState(false),
        [imageName, setImageName] = useState("");

    return <Wizard

        onSubmit={console.log("submitButton")}
        i18nStrings={{
            stepNumberLabel: stepNumber =>
                `Step ${stepNumber}`,
            collapsedStepsLabel: (stepNumber, stepsCount) =>
                `Step ${stepNumber} of ${stepsCount}`,
            skipToButtonLabel: (step, stepNumber) =>
                `Skip to ${step.title}`,
            navigationAriaLabel: "Steps",
            cancelButton: "Cancel",
            previousButton: "Previous",
            nextButton: "Next",
            submitButton: "Launch instance",
            optional: "optional"
        }}
        onNavigate={event => {
            if (activeStepIndex === 0 && slideType === "none") {
                setSlideError("You must choose a slide type before continuing.");
                return;
            }
            setActiveStepIndex(event.detail.requestedStepIndex);
        }}


        activeStepIndex={activeStepIndex}
        steps={[
            {
                title: "Choose a slide type",
                description: "Choose whether you want this slide to be a link to a website, an image, or a PDF.",
                content: <RadioGroup
                    onChange={event => setSlideType(event.detail.value)}
                    value={slideType}
                    items={[
                        { value: "none", label: "None" },
                        { value: "link", label: "Website" },
                        { value: "image", label: "Image" },
                        { value: "pdf", label: "PDF document" },
                    ]}

                />,

                errorText: slideError
            },
            {
                title: "Choose instance type",
                info: <Link variant="Info">Info</Link>,
                description:
                    "Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.",
                content: (
                    <Container
                        header={
                            <Header variant="h2">
                                Form container header
                            </Header>
                        }
                    >
                        <SpaceBetween direction="vertical" size="l">
                            <FormField label="First field">
                                <input
                                    type="file"
                                    disabled={value === "image"}
                                    onChange={event => {
                                        console.log("Look at me!");
                                        console.log(event.target.files[0]);
                                        setImageName(event.target.files[0].name);
                                        const fr = new FileReader();
                                        fr.readAsArrayBuffer(event.target.files[0]);
                                        fr.onload = () => setFileValue0(fr.result);
                                        // setFileValue0(event.target.files[0]);
                                    }}
                                />
                                <Button
                                    onClick={async () => {
                                        console.log("submit");
                                        console.log(fileValue0);
                                        await fetch(`http://localhost:9000/image/${imageName}`, {
                                            method: "POST",
                                            mode: 'cors',
                                            headers: {
                                                "Content-Type": "application/octet-stream"
                                            },
                                            body: new Blob([fileValue0], {type: "image/jpg"} )
                                        });
                                    }}>upload</Button>
                            </FormField>
                        </SpaceBetween>
                    </Container>
                )
            }
        ]}
    />;
    

}
