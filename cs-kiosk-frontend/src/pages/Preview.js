/*
Last updated: 11/27/2022
Last worked on by: Jhon & Matthew
Last added: turned preview into a prop.

Display react/bootstrap carosuel to preview current kiosk display.

-TODO-
NONE

--BUGS--
NONE

*/

import React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";

export default function Preview (props) {
    return <ContentLayout>
        <iframe
            src="http://localhost:9000/carousel"
            width={props.width || "100%"}
            height={props.height || "100%"}
        />
    </ContentLayout>;
}
