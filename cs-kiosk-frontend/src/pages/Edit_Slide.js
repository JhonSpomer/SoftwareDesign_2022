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
    const [value, setValue] = React.useState(false);

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
                                    value={fileValue0}
                                    disabled={value}
                                    onChange={event => {
                                        console.log("Look at me!");
                                        setFileValue0(fileValue0);
                                        console.log(fileValue0)
                                    }}
                                />
                                <Button
                                    onClick={() => {
                                        console.log("submit");
                                    }}>upload</Button>
                            </FormField>
                        </SpaceBetween>
                    </Container>
                )
            }
        ]}
    />;
}
