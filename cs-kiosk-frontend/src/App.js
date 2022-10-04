/*
Last update: 10/4/2022 9:00 PM
Last worked on by: Jhon
Last added: navbar work, dissabling navbar on login page. Documentation.


login page and front end, hides nav bar, with error validation.  

-TODO-
connect to db and remove hard coded test credentials
replace checkbox terms with actual text.

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

//variables
function App() {
  const
    [userValue, setUserValue] = useState();
  const [passwordValue, setPasswordValue] = React.useState("");
  const [ErrorValue, setErrorValue] = React.useState("");
  const [activeHref, setActiveHref] = React.useState("/");
  const [navigationHide, setNavValue] = React.useState(true);
  const [toolsHide, setToolsValue] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = React.useState(false);

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
          <Route path="*" element={<div>This is default page</div>} />
          <Route path="/test" element={<Tests />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/users" element={<Users />} />

          <Route path="/" element={
            <div>
              <form onSubmit={e => e.preventDefault()}>
                <Form
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        variant="primary"
                        disabled={!checked}
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

  function querry(usrName, pssWord) {
    //later should querry db, for now, it just flags todo error state.
    //check if user credentials are in database

    //TODO


    //reset navbar access
    //placeholder var checking.
    if (usrName == "susan" && pssWord == "admin") {
      setNavValue(false);
      navigate("/admin");
    }
    else {
      setErrorValue("INVALID CREDENTIALS");
    }
  }


}


export default App;
