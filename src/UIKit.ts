import * as sm from "@mixery/state-machine";
import { Component, ComponentCreateOutput } from "./components/Component.js";
import { Fragment } from "./components/Fragment.js";

export namespace UIKit {
    export type ComponentCreateInput = { new(): Component } | string | sm.Slot<any> | typeof fragment;

    export function create(component: ComponentCreateInput, options: object, ...children: ComponentCreateOutput[]): ComponentCreateOutput {
        options = options || {};

        if (typeof component == "string") return createDOM(component, options, children);
        if (component instanceof sm.Slot) return createSlot(component);
        if (component == fragment) return new Fragment().create(children);

        return createComponent(component, options, children);
    }

    export function createSlot(slot: sm.Slot<any>) {
        let e = document.createElement("span");
        slot.onUpdate.add(newValue => e.textContent = `${newValue}`);
        e.textContent = `${slot.value}`;
        return e;
    }

    export function createComponent(componentClass: { new(): Component }, options: object, children: ComponentCreateOutput[]) {
        let component = new componentClass();
        Object.keys(options).forEach(k => {
            const valueIn = options[k];

            if (typeof component[k] == "function") {
                component[k](valueIn);
            } else if (component[k] instanceof sm.Slot) {
                if (valueIn instanceof sm.Slot) valueIn.bindTo(component[k]);
                else (component[k] as sm.Slot<any>).value = valueIn;
            } else {
                component[k] = valueIn;
            }
        });

        let output = component.create(children);
        if (output instanceof Fragment) component._fragment = output;
        else if (output instanceof HTMLElement) component._element = output;
        component.postCreate();
        
        return component;
    }

    export function createDOM(name: string, options: object, children: ComponentCreateOutput[]) {
        let e = document.createElement(name);
        Object.keys(options).forEach(k => {
            const v = options[k];
            if (typeof v == "function") e[k] = v;
            else e.setAttribute(k, `${v}`);
        });

        children.forEach(child => appendTo(e, child));
        return e;
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