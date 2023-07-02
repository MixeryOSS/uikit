# Mixery UIKit
_The UI "framework", designed for Mixery._

## Should you use UIKit?
It depends on your use case. If you just want a simple webpage, please consider writing it in HTML + SCSS (or CSS if you don't need nesting), or use Astro.

If you want a simple single page webapp, you can use different libraries that are well established, such as React, Angular, Vue, etc...

If you want to use the power of component states propagation (``@mixery/state-machine``) or you are working with Mixery then UIKit is for you.

That said, you can try using ``state-machine`` in other libraries, it's just that UIKit was designed to work well with ``state-machine``. See example below to have an idea of how we tried to solves states management problem.

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

### Using ``Component#on``
```tsx
(<MyComponent />).on("click", e => console.log("clicked"))
```