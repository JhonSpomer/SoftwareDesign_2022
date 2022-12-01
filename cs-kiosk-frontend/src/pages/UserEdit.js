/*
Last updated: 11/29/2022
Last worked on by: Jhon
Last added: Deprecation note.

This page displays the current users in the database to susan. This is DEPRECATED. The page remains for records sake, but currently is unused in the kiosk softeware.

-TODO-
NONE. DEPRECATED

*/
import React from 'react'; //nothing here yet. 
import { useState } from 'react';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from "@cloudscape-design/components/space-between";
import Usestate from 'react'
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";

export default function UserEdit(props) {

    const [UserValue, setUserValue] = useState(),
        [PasswordValue, setPasswordValue] = useState();

    return <div><Header><h3>Enter a username and password</h3></Header> <SpaceBetween
        size="s"
        direction="vertical">
        <Input
            value={UserValue}
            onChange={event => setUserValue(event.detail.value)}></Input>
        <Input
            value={PasswordValue}
            onChange={event => setPasswordValue(event.detail.value)}></Input>
        <Button
            onClick={async () => {
                console.log("change submit");
                console.log(UserValue);
                console.log(PasswordValue);
                //hit db here

            }
            }>Submit Changes</Button></SpaceBetween> </div>




}