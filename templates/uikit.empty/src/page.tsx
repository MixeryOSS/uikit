import { Slot } from "@mixery/state-machine";
import { UIKit } from "@mixery/uikit";
import { ClickyButton } from "./components/ClickyButton.js";

// This is your main page with UIKit library and JSX syntactic sugar.
// You can use UIKit.appendTo(document.body, ...jsx) instead of a function
// for your app.
function App() {
    const sharedState = new Slot(0);

    return <>
    <span>Hello UIKit!</span><br/>
    <ClickyButton counter={sharedState}/><br/>
    <ClickyButton counter={sharedState}/>
    </>;
}

UIKit.appendTo(document.body, <App/>);
