import { Slot } from "@mixery/state-machine";
import { UIKit } from "@mixery/uikit";

export function ClickyButton(prop: UIKit.Properties & {
    counter?: Slot<number>
}) {
    const counter = new Slot<number>(0).bindFrom(prop.counter);

    return <button event:click={() => counter.value++}>Clicks: {counter}</button>;
}
