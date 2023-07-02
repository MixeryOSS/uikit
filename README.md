# Mixery UIKit
_The UI "framework", designed for Mixery._

## Example
```tsx
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
    <div onclick={e => console.log("You clicked me!")}>Open console and click this element</div>
</>);

setInterval(() => counter.value++, 500);
```

## Registering event listeners
There are 3 ways to register events:

### Using ``event:<Event>`` (only apply to custom components)
This allows you to have access to component data inside your listener.

```tsx
<MyComponent event:click={(e, c) => {
    console.log(c instanceof MyComponent); // true
    c.myComponentData = 123;
}}>
```

### Using ``on<Event>``
This will register your event listeners to HTML element or children in fragment (if your ``create()`` returns a fragment).

```tsx
<div onclick={e => console.log("clicked")}>Click me!</div>
<MyComponent onclick={e => console.log("clicked custom component")} />
```

## Using ``Component#on``
```tsx
(<MyComponent />).on("click", e => console.log("clicked"))
```