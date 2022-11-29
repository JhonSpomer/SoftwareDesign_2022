/*
Last updated: 11/29/2022
Last updated by: Jhon & Matt
Last change: Connecting to the actual endpoint that talks to the backend.



This page allows the user to modify or create a new slide to put into the carousel. It should support links, pdf, png/jpg. Currently it only supports png.jpg and
links, including web3!

--BUGS--

--TODO--
*/

import React, {useState, useEffect} from "react";
import Wizard from "@cloudscape-design/components/wizard";
import RadioGroup from "@cloudscape-design/components/radio-group";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";

export default function EditSlide(props) {
    const
        [activeStepIndex, setActiveStepIndex] = useState(0),
        [slideError, setSlideError] = useState(undefined),
        [id, setId] = useState(undefined),
        [slide, setSlide] = useState({}),
        [oldSlide, setOldSlide] = useState({}),
        [fileName, setFileName] = useState("file.txt"),
        [file, setFile] = useState(undefined);

    useEffect(() => {
        const parsedLocation = window.location.href.match(/\/edit\/slide\/([^/]+)$/);
        if (parsedLocation[1] !== "new") setId(parsedLocation[1]);
    }, []);

    useEffect(() => {
        if (id === undefined) return;
        const foundSlide = props.slides.find(s => void(console.log("Ids:", s._id, id)) || s._id === id);
        if (!foundSlide) {
            props.navigate("/edit/slide/new");
            return;
        }
        setSlide(foundSlide);
        setOldSlide(foundSlide);
    }, [id]);

    useEffect(() => {
    }, [slide]);

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
            submitButton: "Submit and View",
            optional: "optional"
        }}
        activeStepIndex={activeStepIndex}
        steps={[
            {
                title: "Choose a slide type",
                description: "Choose whether you want this slide to be a link to a website, an image, or a PDF.",
                content: <FormField
                    label="Slide type:"
                >
                    <RadioGroup
                        onChange={event => {
                            console.log(slide);
                            setSlide({...slide, slideType: event.detail.value});
                        }}
                        value={slide.slideType || "none"}
                        items={[
                            {value: "none", label: "None"},
                            {value: "link", label: "Website"},
                            {value: "image", label: "Image"},
                            {value: "pdf", label: "PDF document"},
                        ]}
                    />
                </FormField>,
                errorText: slideError
            },
            {
                title: "Enter a slide name",
                description: "Choose a name for your slide for easy reference.",
                content: <FormField
                    label="Slide name:"
                >
                    <Input
                        value={slide.slideName || ""}
                        onChange={event => setSlide({...slide, slideName: event.detail.value})}
                    />
                </FormField>,
                errorText: slideError
            },
            {
                title: "Choose a file",
                description:
                    "Choose a file to upload to the slide or a URL to display in the slide",
                content: {
                    "image": <FormField
                        label="Select a file to upload:"
                    >
                        <input
                            type="file"
                            disabled={slide.slideType !== "image"}
                            onChange={event => {
                                setFileName(event.target.files[0].name);
                                const fr = new FileReader();
                                fr.readAsArrayBuffer(event.target.files[0]);
                                fr.onload = () => setFile(fr.result);
                            }}
                        />
                    </FormField>,
                    "link": <FormField
                        label="Enter website link:"
                    >
                        <Input
                            value={typeof slide.content === "string" ? slide.content : ""}
                            onChange={event => setSlide({...slide, content: event.detail.value})}>
                        </Input>
                    </FormField>,
                    "pdf": <FormField
                        label="Select a PDF:"
                    >
                        <input
                            type="file"
                            disabled={slide.slideType !== "pdf"}
                            onChange={event => {
                                setFileName(event.target.files[0].name);
                                const fr = new FileReader();
                                fr.readAsArrayBuffer(event.target.files[0]);
                                fr.onload = () => setFile(fr.result);
                            }}
                        />
                    </FormField>
                }[slide.slideType],
                errorText: slideError
            }
        ]}
        onNavigate={event => {
            if (activeStepIndex === 0 && (slide.slideType === undefined || slide.slideType === "none")) {
                setSlideError("You must choose a slide type before continuing.");
                return;
            } else if (activeStepIndex === 1 && !slide.slideName) {
                setSlideError("You must type a name for the slide before continuing.");
                return;
            } else setSlideError(undefined);
            setActiveStepIndex(event.detail.requestedStepIndex);
        }}
        onSubmit={async () => {
            let location = window.location.href;
            if (location === 'http://localhost:3000/edit/slide/new') {
                if (slide.slideType === 'link') {
                    //
                    //====================================LINK=======================================================
                    //
                    console.log(slide);
                    let Creds = sessionStorage.getItem("UserCreds");
                    console.log("Credentials:", Creds);
                    const res = await fetch(`http://localhost:9000/slide.json`, {
                        method: "POST",
                        mode: 'cors',
                        headers: {
                            "Content-Type": "text/plain",
                            "Authorization": `Basic ${Creds}`
                        },
                        body: JSON.stringify(slide)
                    });
                } else if (slide.slideType === 'image') {
                    //
                    //==============================IMAGE=============================================
                    //
                    const match = fileName.match(/(png|jpg)$/);
                    if (!match) {
                        setSlideError("Only PNG and JPG image formats are supported.");
                        return;
                    }
                    let Creds = sessionStorage.getItem("UserCreds");
                    console.log("Credentials:", Creds);
                    const res = await fetch(`http://localhost:9000/image/new?type=${match[1]}`, {
                        method: "POST",
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "Authorization": `Basic ${Creds}`
                        },
                        body: file
                    });
                    const IDvalue = await res.text();
                    console.log(IDvalue);
                    if (res.ok) {
                        let Creds = sessionStorage.getItem("UserCreds");
                        console.log("Credentials:", Creds);
                        const res2 = await fetch(`http://localhost:9000/slide.json`, {
                            method: "POST",
                            mode: 'cors',
                            headers: {
                                "Content-Type": "text/plain",
                                "Authorization": `Basic ${Creds}`
                            },
                            body: JSON.stringify({...slide, content: IDvalue})
                        });
                        // const IDTest = await res2.text();
                    }
                } else if (slide.slideType === 'pdf') {
                    //
                    // ==========================PDF========================================
                    //
                    let Creds = sessionStorage.getItem("UserCreds");
                    console.log("Credentials:", Creds);
                    const res = await fetch(`http://localhost:9000/pdf/new`, {
                        method: "POST",
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "Authorization": `Basic ${Creds}`
                            
                        },
                        body: file
                    });
                    const IDvalue = await res.text();
                    console.log(IDvalue);
                    if (res.ok) {
                        let Creds = sessionStorage.getItem("UserCreds");
                        console.log("Credentials:", Creds);
                        const res2 = await fetch(`http://localhost:9000/slide.json`, {
                            method: "POST",
                            mode: 'cors',
                            headers: {
                                "Content-Type": "text/plain",
                                "Authorization": `Basic ${Creds}`
                            },
                            body: JSON.stringify({...slide, content: IDvalue})
                        });
                        // const IDTest = await res2.text();
                    }
                }
            } else {
                console.log("edit slide");
                console.log(location);
            }

            const href = `/preview`;
            props.setActiveHref(href);
            props.navigate(href);
        }}
        onCancel={() => props.navigate("/admin")}
    />;
}

