/*
Last updated: 11/1/2022
Last updated by: Jhon
Last change: edit and delete now work properly.


--BUGS--
-navigating off the page resets the array

--TODO--
-Get the slide rename function to work
-link to database rather than test array
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
import Input from "@cloudscape-design/components/input";


export default function EditSlide(props) {
    const
        [activeStepIndex, setActiveStepIndex] = useState(0),
        [slideType, setSlideType] = useState("none"),
        [slideError, setSlideError] = useState(undefined),
        [fileValue0, setFileValue0] = useState(),
        [value, setValue] = React.useState(false),
        [imageName, setImageName] = useState(""),
        [urlValue1, setUrlValue1] = useState(),
        [PDFValue, setPDFValue] = useState(),
        [PDFName, setPDFName] = useState(""),
        [SlideName, setSlideName] = useState("");
    return <Wizard

        onSubmit={async () => {
            console.log("final submit!");
            const href = `/preview`;
            props.setActiveHref(href);
            props.navigate(href);

        }}
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
            submitButton: "View Preview",
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
                    onChange={
                        event => setSlideType(event.detail.value)
                        // setWhich(false)


                    }
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
                title: "Enter a slide name",
                description: "Choose a name for your slide for easy reference.",
                content: <Container><Input
                value={SlideName}
                onChange={event => setSlideName(event.detail.value)}></Input>
                <Button
                onClick={async () => {
                    console.log("name submit!");
                    console.log(SlideName)
                    //setSlideName(event.detail.value)
                    //setUrlValue1("");

                    //hit db here

                }
                }>submit</Button></Container>
            },
            {
                title: "Choose a file",
                description:
                    "Choose a file to upload to the slide or a URL to display in the slide",
                content: {

                    "image": (
                        <Container
                            header={
                                <Header variant="h2">
                                    Select a file to upload
                                </Header>
                            }
                        >
                            <SpaceBetween direction="vertical" size="l">
                                <FormField label="First field">
                                    <input
                                        type="file"
                                        disabled={value === "image"}
                                        onChange={event => {
                                            //console.log("Look at me!");
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
                                            await fetch(`http://localhost:9000/image/635b2c87c1078d59803396c8`, {
                                                method: "POST",
                                                mode: 'cors',
                                                headers: {

                                                //${imageName} old 
                                                //await fetch(`http://localhost:9000/image/${imageName}' , {
                                                    "Content-Type": "application/octet-stream"
                                                },
                                                body: fileValue0
                                            });
                                        }}>upload</Button>
                                </FormField>
                            </SpaceBetween>
                        </Container>
                    ),
                    "link": (
                        <Container
                            header={
                                <Header variant="h2">
                                    Enter a website to display
                                </Header>
                            }
                        >
                            <Input
                                value={urlValue1}
                                onChange={event => setUrlValue1(event.detail.value)}>
                            </Input>
                            <Button
                                onClick={async () => {
                                    console.log("url submit!");
                                    console.log(urlValue1)
                                    setUrlValue1("");

                                    //hit db here

                                }
                                }
                            >Upload</Button></Container>
                    ),
                    "pdf": (
                        <Container
                            header={
                                <Header variant="h2">
                                    Enter a pdf to display
                                </Header>
                            }
                        >                            <SpaceBetween direction="vertical" size="l">
                                <FormField label="First field">
                                    <input
                                        type="file"
                                        disabled={value === "pdf"}
                                        onChange={event => {
                                            console.log(event.target.files[0]);
                                            setPDFName(event.target.files[0].name);
                                            const fr = new FileReader();
                                            fr.readAsArrayBuffer(event.target.files[0]);
                                            fr.onload = () => setPDFValue(fr.result);
                                            // setFileValue0(event.target.files[0]);
                                        }}
                                    />
                                    <Button
                                        onClick={async () => {
                                            console.log("submit");
                                            console.log(PDFValue);

                                        }}>upload</Button>
                                </FormField>
                            </SpaceBetween></Container>
                    )
                }[slideType]
            }
        ]}
    />;


}

