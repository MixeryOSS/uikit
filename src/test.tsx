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
setInterval(() => counter.value++, 500);

UIKit.appendTo(document.body, <>
    <MyComponent counter={counter} onclick={(e: MouseEvent) => {
        console.log(++counter.value);
    }} />
    <div onclick={e => console.log("You clicked me!")}>Open console and click this element</div>
</>);

function MyFunctionComponent(options: UIKit.ComponentOptions & {
    slot?: Slot<number>
}) {
    const slot = new Slot(0).bindFrom(options?.slot);

    return <>
    Counter: {slot}
    </>;
}

UIKit.appendTo(document.body, <MyFunctionComponent slot={counter} onclick={e => console.log(MyFunctionComponent.name)} />)