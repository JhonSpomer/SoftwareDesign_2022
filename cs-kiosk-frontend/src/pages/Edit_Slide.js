import React, { useState } from "react";
import Wizard from "@cloudscape-design/components/wizard";
import RadioGroup from "@cloudscape-design/components/radio-group";

export default function EditSlide() {
    const
        [activeStepIndex, setActiveStepIndex] = useState(0),
        [slideType, setSlideType] = useState("none"),
        [slideError, setSlideError] = useState(undefined);

    return <Wizard
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
                        {value: "none", label: "None"},
                        {value: "link", label: "Website"},
                        {value: "image", label: "Image"},
                        {value: "pdf", label: "PDF document"}
                    ]}
                />,
                errorText: slideError
            }
        ]}
    />;
}
