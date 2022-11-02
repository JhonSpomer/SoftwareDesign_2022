/*
Last updated: 10/27/2022
Last worked on by: Jhon & Matthew
Last added: Nothing!

Display react/bootstrap carosuel to preview current kiosk display.

-TODO-
NONE

--BUGS--

PREVIEW IS SKEWED RIGHT

*/

import React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";

export default function Preview () {
    return <ContentLayout>
        <iframe
            src="http://localhost:9000/carousel"
            width={"100%"}
            height={"100%"}
        />
    </ContentLayout>;
}
