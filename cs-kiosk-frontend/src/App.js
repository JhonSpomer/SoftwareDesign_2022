//Last update 9/22/2022 5:00 PM
//Jhon. 
//Last added: querry function.

// I am starting to try and create the login form. I believe we only need
//the two fields for this page in particular. 
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
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Admin from "./pages/Admin"
import Preview from "./pages/Preview"
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

//import setActiveHref from "@cloudscape-design/components/s"

import './App.css';

//variables
function App() {
  const
    [userValue, setUserValue] = useState();
  const [passwordValue, setPasswordValue] = React.useState("");
  const [ErrorValue, setErrorValue] = React.useState("");
  const [activeHref, setActiveHref] = React.useState("page1");
  const [onAdminPage, setAdminPage] = React.useState(false);
  const [onPreviewPage, setPreviewPage] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Applayout
      navigation={
        <SideNavigation
          activeHref={activeHref}
          header={{ href: "/", text: "Admin Navigation" }}
          onFollow={event => {
            if (!event.detail.external) {
              event.preventDefault();
              setActiveHref(event.detail.href);
              navigate(event.detail.href);
              //setAdminPage(true);
              
            }
          }}
          items={[
            { type: "link", text: "Admin", href: "page1" },
            { type: "link", text: "Preview", href: "page2" },
            { type: "link", text: "Content", href: "page3" },
            { type: "link", text: "Login", href: "page4" },
            { type: "divider" }
            ,{
              //TODO
              type: "link",
              text: "User Guide",
              href: "https://example.com",
              external: true
            }
          ]}
        />
      }


      content={

      <Routes>
        <Route path="*" element={<div> default </div>}/>
        <Route path="/page1" element={<Admin />}/>
        <Route path="/page4" element={
           <form onSubmit={e => e.preventDefault()}>
           <Form
             actions={
               <SpaceBetween direction="horizontal" size="xs">
 
 
 
                 <Button
                   variant="primary"
                   onClick={() => {
                     setUserValue("");
                     setPasswordValue("");
                     querry(userValue, passwordValue);
 
                   }}
                 >Submit</Button>
               </SpaceBetween>
             }
             header={<Header variant="h1">Form header</Header>}
           >
             <FormField
               description="Username"
               label=""
               errorText={ErrorValue}
             >
               <Input
                 value={userValue}
                 onChange={event => setUserValue(event.detail.value)
 
                 }
               />
             </FormField>
             <FormField
               description="Password"
               label=""
               errorText={ErrorValue}
             >
               <Input
                 value={passwordValue}
                 onChange={event => setPasswordValue(event.detail.value)
                 }
               />
             </FormField>
           </Form>
         </form>
        } />
    </Routes>
       

      }
    />
  );

  function querry(usrName, pssWord) {
    //later should querry db, for now, it just flags todo error state.
    setErrorValue("TODO ERROR");
    //return null;
  }


}


export default App;
