/*
Last update: 10/27/2022 9:00 PM
Last worked on by: Jhon
Last added: Cleaned up stateful values.


login page and front end, hides nav bar, with error validation.  

-TODO-
Remove Hardcoded credentials.

--BUGS--
-Page starts on login in the nav bar, even though it redirects to admin.
-Can skip login page by direct path in navbar.
*/

//imports
import React, { useEffect, useState } from 'react';

import "@cloudscape-design/global-styles/index.css"
import Applayout from "@cloudscape-design/components/app-layout";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between"
import Header from "@cloudscape-design/components/header"
import FormField from "@cloudscape-design/components/form-field";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Checkbox from "@cloudscape-design/components/checkbox";
import Admin from "./pages/Admin"
import Users from "./pages/Users"
import Tests from "./pages/Test"
import Preview from "./pages/Preview"
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";
import './App.css';
import EditSlide from './pages/Edit_Slide';

//variables
function App() {
  const
   [userValue, setUserValue] = useState(),
   [passwordValue, setPasswordValue] = React.useState(""),
   [ErrorValue, setErrorValue] = React.useState(""),
   [activeHref, setActiveHref] = React.useState("/"),
   [navigationHide, setNavValue] = React.useState(true),
   [toolsHide, setToolsValue] = React.useState(true),
   navigate = useNavigate(),
   location = useLocation(),
   [checked, setChecked] = React.useState(false);

  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname === "/") {
      setNavValue(true);
      setToolsValue(true);
    }
  }, [location]);


  return (
    <Applayout
      navigationHide={navigationHide}
      toolsHide={toolsHide}
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
            , {
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
          <Route path="*" element={<div>Oh no! You appear to have gotten lost. Please restart the system to get back to the login page. If this does not fix this problem. Please contact the system maintence team.</div>} />
          <Route path="/test" element={<Tests />} />
          <Route path="/admin" element={<Admin
            navigate={navigate}
            setActiveHref={setActiveHref}
          />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/edit/*" element={<EditSlide
            navigate={navigate}
            setActiveHref={setActiveHref} />} />

          <Route path="/" element={
            <div>
                <Form
                    actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button
                        variant="primary"
                        disabled={!checked}
                        onClick={() => {
                            setUserValue("");
                            setPasswordValue("");
                            query(userValue, passwordValue);
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

              <Checkbox
                onChange={({ detail }) =>
                  setChecked(detail.checked)
                }
                checked={checked}
              >
                YOU AGREE TO THE --TODO-- TERMS. GREAT THANKS
              </Checkbox>

            </div>
          } />
        </Routes>
      }
    />
  );

  function query(usrName, pssWord) {
    //later should query db, for now, it just flags todo error state.
    //check if user credentials are in database

    //TODO


    //reset navbar access
    //placeholder var checking.
    if (usrName === "susan" && pssWord === "admin") {
      setNavValue(false);
      navigate("/admin");
    }
    else {
      setErrorValue("INVALID CREDENTIALS");
    }
  }


}


export default App;
