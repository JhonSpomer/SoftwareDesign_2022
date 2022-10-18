/*
Last updated: 9/29/2022
Last worked on by: Jhon
Last added: Nothing!

Display react/bootstrap carosuel to preview current kiosk display.

-TODO-
literally all of it.

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
