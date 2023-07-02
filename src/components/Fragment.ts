import { UIKit } from "../UIKit.js";
import { Component, ComponentCreateOutput } from "./Component.js";

export class Fragment extends Component {
    children: ComponentCreateOutput[];

    override create(children: ComponentCreateOutput[]): ComponentCreateOutput {
        this.children = children;
        return this;
    }

    override on<T extends keyof HTMLElementEventMap>(type: T, callback: (event: HTMLElementEventMap[T]) => any): void {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof HTMLElement) child.addEventListener(type, callback);
            else if (child instanceof Component) child.on(type, callback);
            else this.children[i] = UIKit.createSlot(child);
        }
    }
}