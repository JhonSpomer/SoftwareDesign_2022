//Last update 9/22/2022 3:00 PM
//Jhon. 
//Added Error state.

// I am starting to try and create the login form. I believe we only need
//the two fields for this page in particular. I still don't know what is up with the button. 
//


import React, { useState } from 'react';
import "@cloudscape-design/global-styles/index.css";
import Applayout from "@cloudscape-design/components/app-layout";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";

import './App.css';

//variables
function App() {
  const
    [userValue, setUserValue] = useState();
  const [passwordValue, setPasswordValue] = React.useState("");
  const [ErrorValue, setErrorValue] = React.useState("");

  return (
    <Applayout

      content={
        <form onSubmit={e => e.preventDefault()}>
          <Form
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                
            
                
                <Button
                  variant="primary"
                  onClick={() => {
                    setUserValue("");
                    setPasswordValue("");
                    //setErrorValue("AEIUGAEG");
                  }}
                >Submit</Button>
              </SpaceBetween>
            }
            header={<Header variant="h1">Form header</Header>}
          >
            <FormField
              description="Username"
              label=""
              errorText= {ErrorValue}
            >
              <Input
                value={userValue}
                onChange={event => setUserValue(event.detail.value)
                //errorText="ERROR"
                }
              />
            </FormField>
            <FormField
              description="Password"
              label=""
              errorText = {ErrorValue}
            >
              <Input
                value={passwordValue}
                onChange={event => setPasswordValue(event.detail.value)
                }
              />
            </FormField>
          </Form>
        </form>

      }
    />
  );
}


export default App;
