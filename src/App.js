//Last update 9/20/2022 3:00 PM
//Jhon
// I am starting to try and create the login form. I believe we only need
//the two fields for this page in particular. I still don't know what is up with the button.


import React, {useState} from 'react';
import "@cloudscape-design/global-styles/index.css";
import Applayout from "@cloudscape-design/components/app-layout";
import Input1 from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";

import './App.css';

function App() {
    const
        [value, setValue] = useState();
    const [inputValue, setInputValue] = React.useState("");
        
    return (
        <Applayout

            content={
                <form onSubmit={e => e.preventDefault()}>
                <Form
//r={<Header variant="h1">Form header</Header>}
                >
                     <FormField
      description="Username"
      //label="Form field label"
    >
      <Input
        value={inputValue}
        onChange={event =>
          setInputValue(event.detail.value)
        }
      />
    </FormField>
    <FormField
      description="Password"
      //label="Form field label"
    >
      <Input
        value={inputValue}
        onChange={event =>
          setInputValue(event.detail.value)
        }
      />
    </FormField>
                </Form>
                <Input1
                    type="text"
                    onChange={event => setValue(event.detail.value)}
                    value={value}
                />
              </form>
              
            }
            /*
            content1={
                
                <Input
                   type="text"
                   onChange={event => setValue(event.detail.value)}
                   value={value}
                />
                
            }
            */
        />
    );
}

export default App;
