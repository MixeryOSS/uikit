import { Slot } from "@mixery/state-machine";
import { UIKit } from "../UIKit.js";
import { Component, ComponentCreateOutput } from "./Component.js";

export class Fragment extends Component {
    children: ComponentCreateOutput[];

    override create(children: ComponentCreateOutput[]): ComponentCreateOutput {
        this.children = children;
        return this;
    }

    override on<T extends keyof HTMLElementEventMap>(type: T, callback: (event: HTMLElementEventMap[T]) => any): this {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            
            if (child instanceof Slot) this.children[i] = child = UIKit.createSlot(child);
            else if (typeof child == "string") {
                const e = document.createElement("span");
                e.textContent = child;
                this.children[i] = child = e;
            }

            if (child instanceof HTMLElement) child.addEventListener(type, callback);
            else if (child instanceof Component) child.on(type, callback);
        }

        return this;
    }
}