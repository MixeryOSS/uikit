import * as sm from "@mixery/state-machine";
import { Label } from "./components/Label.js";
import { UIKitWebComponentBaseClass } from "./components/WebComponent.js";

export namespace UIKit {
    export type ValidElement = string | HTMLElement | sm.ISlot<any> | ValidElement[];

    export type FunctionComponent = (
        options: Record<string, any>,
        children: ValidElement
    ) => HTMLElement | ValidElement[];
    export type ValidComponent = string | typeof fragment | FunctionComponent;

    export type Properties = Record<string, any> & {
        "uikit:html"?: (element: HTMLElement) => any,
        
        [x: `event:${string}`]: (e: Event) => any,
        [x: `event:mouse${string}`]: (e: MouseEvent) => any,
        "event:click"?: (e: MouseEvent) => any,
        [x: `event:pointer${string}`]: (e: PointerEvent) => any,
        [x: `event:key${string}`]: (e: KeyboardEvent) => any,
    };

    export function appendTo(target: ParentNode, ...children: ValidElement[]) {
        children.forEach(child => {
            if (typeof child == "string" || child instanceof HTMLElement) target.append(child);
            else if ("value" in child) target.append(Label({ slot: child }));
            else if (child instanceof Array) appendTo(target, ...child);
        });
    }

    export function createElement(
        element: ValidComponent,
        properties?: Properties,
        ...children: ValidElement[]
    ): HTMLElement | ValidElement[] {
        let out: HTMLElement | ValidElement[];

        if (typeof element == "string") {
            out = document.createElement(element);
            appendTo(out, ...children);
        } else if (typeof element == "function") {
            out = element(properties ?? {}, children);
        } else if (element == fragment) {
            // Fragments can't have properties
            return children;
        }

        // #region Process properties
        if (properties) {
            if (!(out instanceof HTMLElement)) {
                // Attempt to use properties on fragment
                // While it seems impossible at first, you can actually do this by using
                // fragment inside your component and then use <Component property="value" />
                let alt = document.createElement("div");
                alt.style.display = "contents";
                appendTo(alt, ...out);
                out = alt;
            }

            Object.keys(properties).forEach(v => {
                if (v.includes(":")) {
                    if (v == "uikit:html") properties["uikit:html"](out as HTMLElement);
                    else if (v.startsWith("event:")) {
                        const eventName = v.substring(v.indexOf(":") + 1);
                        (out as HTMLElement).addEventListener(eventName, properties["event:" + eventName]);
                    }
                } else if (typeof properties[v] != "object") {
                    (out as HTMLElement).setAttribute(v, properties[v]);
                }
            });
        }
        // #endregion
        // #region Web Components
        if (out instanceof UIKitWebComponentBaseClass) {
            if (out.uiKit_buildingShadow) out.uiKit_buildingShadow = false;
            else appendTo(out, ...children);
        }
        // #endregion

        return out;
    }

    export const fragment = Symbol("Fragment");
}