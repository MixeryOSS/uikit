import { Slot } from "@mixery/state-machine";
import { UIKit } from "./UIKit.js";
import { Component } from "./components/Component.js";

class MyComponent extends Component {
    counter = new Slot(0);

    create() {
        return <div>
            Current value is {this.counter}. Click me to increase counter.
        </div>;
    }
}

const counter = new Slot(0);

UIKit.appendTo(document.body, <>
    <MyComponent counter={counter} onclick={(e: MouseEvent) => {
        console.log(++counter.value);
    }} />
</>);

setInterval(() => counter.value++, 500);

UIKit.appendTo(document.body, <div onclick={e => console.log("You clicked me!")}>Open console and click this element</div>);