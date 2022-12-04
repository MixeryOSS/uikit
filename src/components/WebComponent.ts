import { UIKit } from "../UIKit.js";

export const WebComponents = new Map<string, typeof UIKitWebComponentBaseClass>();

/**
 * Base class for all web components created by UIKit. Should not be used but you can
 * touch it if you want.
 */
export class UIKitWebComponentBaseClass extends HTMLElement {
    public uiKit_buildingShadow = false;
}

export function WebComponent(options: UIKit.Properties & {
    name: string,
    shadow?: boolean,
    template?: boolean
}, children: UIKit.ValidElement[]) {
    if (!WebComponents.has(options.name)) {
        let template: HTMLTemplateElement;

        if (options.template) {
            template = document.createElement("template");
            UIKit.appendTo(template.content, children);
            document.body.appendChild(template);
        }

        const ComponentClass = class extends UIKitWebComponentBaseClass {
            public constructor() {
                super();
                if (options.shadow) {
                    this.attachShadow({ mode: "open" });
                    if (options.template) this.shadowRoot.appendChild(template.content.cloneNode(true));
                    this.uiKit_buildingShadow = true;
                }
            }
        }

        WebComponents.set(options.name, ComponentClass);
        customElements.define(options.name, ComponentClass);
    }

    const elem = document.createElement(options.name);
    if (!options.template) UIKit.appendTo(options.shadow? elem.shadowRoot : elem, ...children);
    return elem;
}