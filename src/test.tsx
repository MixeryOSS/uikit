import * as sm from "@mixery/state-machine";
import { WebComponent } from "./components/WebComponent.js";
import { UIKit } from "./UIKit.js";

function MyComponent(options: UIKit.Properties & {
    mySlot?: sm.Slot<string>
}, children: UIKit.ValidElement[]) {
    const mySlot = new sm.Slot<string>("Default Button Label Here").bindFrom(options?.mySlot);
    const counter = new sm.Slot<number>(0);

    return <>
        { children }
        { mySlot }: { counter } clicks<br/>
        <button event:click={() => counter.value += 1}>Click me!</button><br/>
    </>
}

const sharedState = new sm.Slot("Old state");

UIKit.appendTo(document.body, <>
    <MyComponent mySlot={ sharedState } />
    <MyComponent />
    <MyComponent event:mousemove={() => console.log("hi")}>
        <span>You should see this text before button</span><br/>
    </MyComponent>
</>);

setTimeout(() => sharedState.value = "New state", 1000);

function MyWebComponent(options: UIKit.Properties) {
    return <WebComponent name="my-web-component">
        <span>Hello there!</span>
    </WebComponent>;
}

function MyShadowedWebComponent(options: UIKit.Properties) {
    return <WebComponent name="my-shadowed-web-component" shadow template>
        <style>{`
        :host {
            display: inline-block;
            background: #fca;
            padding: 12px 24px;
            border-radius: 5px;
            border: 1px solid #fa7;
            font-family: Nunito Sans, Calibri, Arial, sans-serif;
            font-size: 12px;
        }
        `}</style>
        <slot name="named-slot"></slot><br/>
        <span>Hello there!</span>
    </WebComponent>;
}

UIKit.appendTo(document.body, <>
    <MyWebComponent event:click={e => sharedState.value = "New 'New state'"}>
        <span> Click me to edit shared state</span><br/>
    </MyWebComponent>
    <MyShadowedWebComponent>
        <MyComponent slot="named-slot" />
    </MyShadowedWebComponent>
</>);
