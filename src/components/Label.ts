import * as sm from "@mixery/state-machine";
import { UIKit } from "../UIKit.js";

export function Label(options?: UIKit.Properties & {
    slot?: sm.ISlot<any>,
    value?: string
}) {
    let span = document.createElement("span");
    let internalSlot = new sm.Slot<any>(options?.value);
    if (options?.slot) internalSlot.bindFrom(options.slot);
    span.textContent = internalSlot.value;

    internalSlot.onUpdate.add(v => {
        span.textContent = v;
    });
    
    return span;
}