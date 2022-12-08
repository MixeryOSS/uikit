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

## Templates
You can install ``uikit.empty`` template to Mixery Templates by using ``mixery-templates install uikit.empty --dir=templates/uikit.empty`` (obviously you need ``@mixery/templates`` installed globally to do this). After that, you can use ``mixery-templates new uikit.empty`` to generate the template. We recommend using ``module`` for tree shaking capability.

This template already have ``tsconfig.json`` configured to use ``UIKit.createElement`` instead of ``React.createElement`` (and somehow esbuild knows it too), so you can use UIKit features, such as auto update for ``state-machine`` slots or Web Components support.
