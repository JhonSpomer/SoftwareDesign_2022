//Last update 9/29/2022 9:00 PM
//
//Last added: navbar work, dissabling navbar on login page.

//imports
import React, { useEffect, useState } from 'react';
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
import { useNavigate, useLocation,Route, Routes } from "react-router-dom";
//import { Route, Routes } from "react-router-dom";
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
  const [navigationHide, setNavValue] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() =>
  {
    console.log(location.pathname)
    if (location.pathname === "/")
    {
      setNavValue(true);
    }
  }, [location]);


  return (
    <Applayout
    navigationHide = {navigationHide}
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
            { type: "link", text: "Admin", href: "admin" },
            { type: "link", text: "Preview", href: "preview" },
            { type: "link", text: "Users", href: "users" },
            { type: "link", text: "Login", href: "/" },
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
        <Route path="*" element={<div>This is default page</div> }/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/preview" element={<div>this is preview</div>}/>
        <Route path="/users" element={<div>this is users</div>}/>

        <Route path="/" element={
          <div> 
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
                     //NavBarBool();
 
                   }}
                 >Submit</Button>
               </SpaceBetween>
             }
             header={<Header variant="h1">Login</Header>}
           >
             <FormField
               description="Username"
               label=""
               errorText={ErrorValue}
             >
               <Input
                 value={userValue}
                 onChange={event => setUserValue(event.detail.value)}
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
        </div>
        } />
    </Routes>
       

      }
    />
  );

  function querry(usrName, pssWord) {
    //later should querry db, for now, it just flags todo error state.
    setErrorValue("TODO ERROR");
    //check if user credentials are in database

    //TODO


    //reset navbar access
    setNavValue(false);
  }


}


export default App;
