import React, {useState} from 'react';
import "@cloudscape-design/global-styles/index.css";
import Applayout from "@cloudscape-design/components/app-layout";
import Input from "@cloudscape-design/components/button";
import './App.css';

function App() {
    const
        [value, setValue] = useState();
    return (
        <Applayout
            content={
                <Input
                    type="text"
                    onChange={event => setValue(event.detail.value)}
                    value={value}
                />
            }
        />
    );
}

export default App;
