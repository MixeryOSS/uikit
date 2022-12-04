# Mixery UIKit
_The UI "framework", designed for Mixery._

## Example
```tsx
import { UIKit } from "@mixery/uikit";
import * as sm from "@mixery/state-machine";

function MyComponent(options: {
    mySlot: string | sm.Slot<string>,
    onClick: (e: MouseEvent) => any
}) {
    return <>
        <span>Hello world!</span><br/>
        {options.mySlot} {/* == <span>{options.mySlot.value}</span> with value updating */}
    </>;
}

const sharedState = new sm.Slot("Shared state!");
UIKit.appendTo(document.body, <MyComponent mySlot={sharedState} />);
sharedState.value = "New state!";
```

More examples can be found in [src/test.tsx](src/test.tsx).
