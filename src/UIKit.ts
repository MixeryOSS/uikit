import * as sm from "@mixery/state-machine";
import { Component } from "./components/Component.js";

export namespace UIKit {
    export type ComponentInput = string | { new(): Component; } | KitInfoAll | typeof fragment | sm.Slot<any>;

    export function create<T>(component: ComponentInput, options: T, ...children: (KitInfo<any> | string | sm.Slot<any>)[]): KitInfo<any> {
        if (component == fragment) {
            return <FragmentInfo> {
                type: KitInfoType.Fragment, children, on(type, callback) {
                    UIKit.applyEvent(this, type, callback);
                    return this;
                },
            };
        } else if (typeof component != "string" && "prototype" in component && component.prototype instanceof Component) {
            const obj = new component();
            Object.keys(options).forEach(k => {
                const valueIn = options[k];

                if (obj[k] instanceof sm.Slot) {
                    if (valueIn instanceof sm.Slot) valueIn.bindTo(obj[k]);
                    else (obj[k] as sm.Slot<any>).value = valueIn;
                } else {
                    obj[k] = valueIn;
                }
            });
            return obj.create(children);
        } else if (typeof component == "string") {
            const element = document.createElement(component);
            if (options) Object.keys(options).forEach(k => {
                const v = options[k];
                if (typeof v == "function") element[k] = v;
                else element.setAttribute(k, `${v}`);
            });

            children.forEach(v => appendTo(element, v as (KitInfoAll | string)));
            return <HTMLElementInfo> {
                type: KitInfoType.HTML, element, on(type, callback) {
                    UIKit.applyEvent(this, type, callback);
                    return this;
                },
            };
        }

        console.warn(`uikit: Unable to convert to KitInfo:`, component);
        return null;
    }

    export function applyEvent<T extends keyof HTMLElementEventMap>(applyTo: KitInfoAll, type: T, callback: (event: HTMLElementEventMap[T]) => any) {
        if (typeof applyTo != "object" || !("type" in applyTo)) return;

        if (applyTo.type == KitInfoType.Fragment) {
            applyTo.children.forEach(v => applyEvent(v as KitInfoAll, type, callback));
        } else if (applyTo.type == KitInfoType.HTML) {
            applyTo.element.addEventListener(type, callback);
        }
    }

    export function appendTo(target: HTMLElement, v: KitInfoAll | string) {
        if (!v) return;

        if (typeof v == "string") {
            target.append(v);
            return;
        } else if (v instanceof sm.Slot) {
            const span = document.createElement("span");
            v.onUpdate.add(newValue => span.textContent = `${newValue}`);
            span.textContent = `${v.value}`;
            target.append(span);
        }

        else if (v.type == KitInfoType.Fragment) v.children.forEach(f => appendTo(target, f as KitInfoAll));
        else if (v.type == KitInfoType.HTML) target.append(v.element);
    }

    export const fragment = Symbol();

    export enum KitInfoType {
        Fragment,
        HTML
    }

    export interface KitInfo<TType extends KitInfoType> {
        type: TType;
        on<T extends keyof HTMLElementEventMap>(type: T, callback: (event: HTMLElementEventMap[T]) => any): this;
    }

    export interface FragmentInfo extends KitInfo<KitInfoType.Fragment> {
        children: KitInfo<any>[];
    }

    export interface HTMLElementInfo extends KitInfo<KitInfoType.HTML> {
        element: HTMLElement;
    }

    export type KitInfoAll = FragmentInfo | HTMLElementInfo;
}