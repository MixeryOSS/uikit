# Mixery UIKit
_The UI "framework", designed for Mixery._

## Example
```tsx
import { UIKit, Component, slotOrDefault } from "@mixery/uikit";
import * as sm from "@mixery/state-machine";

UIKit.appendTo(document.body,
    <>
        <div>Hello world!</div>
    </>
);

// Components
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
    {(<MyComponent counter={counter} />).on("mousedown", e => {
        console.log(++counter.value);
    })}
</>);

setInterval(() => counter.value++, 500);
```