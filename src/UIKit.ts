import * as sm from "@mixery/state-machine";
import { Component, ComponentCreateOutput } from "./components/Component.js";
import { Fragment } from "./components/Fragment.js";

export namespace UIKit {
    type ComponentClass = { new(): Component }
    type ComponentFunction = (options: object, children: ComponentCreateOutput[]) => ComponentCreateOutput;

    export type ComponentCreateInput =
        | ComponentClass
        | ComponentFunction
        | string
        | sm.Slot<any>
        | typeof fragment;

    export type ComponentOptions = {
        [T in keyof HTMLElementEventMap as `on${T}`]?: ((e: HTMLElementEventMap[T]) => any);
    }

    export function create(component: ComponentCreateInput, options: object, ...children: ComponentCreateOutput[]): ComponentCreateOutput {
        options = options || {};

        if (typeof component == "string") return createDOM(component, options, children);
        if (component instanceof sm.Slot) return createSlot(component);
        if (component == fragment) return new Fragment().create(children);
        if ("prototype" in component && component.prototype instanceof Component) return createClassComponent(component as ComponentClass, options, children);

        return createFunctionComponent(component as ComponentFunction, options, children);
    }

    export function createSlot(slot: sm.Slot<any>) {
        let e = document.createElement("span");
        slot.onUpdate.add(newValue => e.textContent = `${newValue}`);
        e.textContent = `${slot.value}`;
        return e;
    }

    export function createFunctionComponent(func: (options: object, children: ComponentCreateOutput[]) => ComponentCreateOutput, options: object, children: ComponentCreateOutput[]) {
        let component = func(options, children);
        if (component instanceof sm.Slot) component = createSlot(component);
        if (component instanceof Component) attachOptionsToClassComponent(component, options, true);
        if (component instanceof HTMLElement) attachOptionsToDOM(component, options, true);
        return component;
    }

    export function createClassComponent(componentClass: { new(): Component }, options: object, children: ComponentCreateOutput[]) {
        let component = new componentClass();
        attachOptionsToClassComponent(component, options);

        let output = component.create(children);
        if (output instanceof Fragment) component._fragment = output;
        else if (output instanceof HTMLElement) component._element = output;
        component.postCreate();
        
        return component;
    }

    export function attachOptionsToClassComponent(component: Component, options: object, onlyEvents = false) {
        Object.keys(options).forEach(k => {
            const valueIn = options[k];

            if (k.startsWith("event:")) {
                const name = k.split(":", 2)[1];
                component.on(name as keyof HTMLElementEventMap, e => {
                    valueIn(e, component);
                });
                return;
            }

            if (onlyEvents && !k.startsWith("on")) return;

            if (typeof component[k] == "function") {
                component[k](valueIn);
            } else if (component[k] instanceof sm.Slot) {
                if (valueIn instanceof sm.Slot) valueIn.bindTo(component[k]);
                else (component[k] as sm.Slot<any>).value = valueIn;
            } else {
                component[k] = valueIn;
            }
        });
    }

    export function createDOM(name: string, options: object, children: ComponentCreateOutput[]) {
        let dom = document.createElement(name);
        attachOptionsToDOM(dom, options);

        children.forEach(child => appendTo(dom, child));
        return dom;
    }

    export function attachOptionsToDOM(dom: HTMLElement, options: object, onlyEvents = false) {
        Object.keys(options).forEach(k => {
            if (onlyEvents && !k.startsWith("on")) return;

            const v = options[k];
            if (typeof v == "function") dom[k] = v;
            else dom.setAttribute(k, `${v}`);
        });
    }

    export function appendTo(target: HTMLElement, v: ComponentCreateOutput) {
        if (v instanceof Fragment) {
            v.children.forEach(child => appendTo(target, child));
            return;
        } else if (v instanceof Component) {
            if (v._element) target.append(v._element);
            else if (v._fragment) appendTo(target, v._fragment);
        } else if (v instanceof sm.Slot) {
            target.append(createSlot(v));
        } else {
            target.append(v);
        }
    }

    export const fragment = Symbol();
}