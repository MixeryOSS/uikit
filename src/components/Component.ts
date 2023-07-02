import { Slot } from "@mixery/state-machine";
import { Fragment } from "./Fragment.js";

export abstract class Component {
    _element: HTMLElement;
    _fragment: Fragment;
    get _initialized() { return this._element || this._fragment; }
    _storedEvents: [string, (e: Event) => any][] = [];

    abstract create(children: ComponentCreateOutput[]): ComponentCreateOutput;

    postCreate() {
        this._storedEvents.forEach(v => {
            const [type, callback] = v;
            this.on(type as keyof HTMLElementEventMap, callback);
        });
    }

    on<T extends keyof HTMLElementEventMap>(type: T, callback: (event: HTMLElementEventMap[T]) => any) {
        if (!this._initialized) {
            this._storedEvents.push([type, callback]);
            return;
        }

        if (this._element) this._element.addEventListener(type, callback);
        else if (this._fragment) this._fragment.on(type, callback);
        return this;
    }
}

// Automate prototype thing
([
    "abort",
    "animationcancel",
    "animationend",
    "animationiteration",
    "animationstart",
    "auxclick",
    "beforeinput",
    "blur",
    "cancel",
    "canplay",
    "canplaythrough",
    "change",
    "click",
    "close",
    "compositionend",
    "compositionstart",
    "compositionupdate",
    "contextmenu",
    "copy",
    "cuechange",
    "cut",
    "dblclick",
    "drag",
    "dragend",
    "dragenter",
    "dragleave",
    "dragover",
    "dragstart",
    "drop",
    "durationchange",
    "emptied",
    "ended",
    "error",
    "focus",
    "focusin",
    "focusout",
    "formdata",
    "gotpointercapture",
    "input",
    "invalid",
    "keydown",
    "keypress",
    "keyup",
    "load",
    "loadeddata",
    "loadedmetadata",
    "loadstart",
    "lostpointercapture",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "paste",
    "pause",
    "play",
    "playing",
    "pointercancel",
    "pointerdown",
    "pointerenter",
    "pointerleave",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "progress",
    "ratechange",
    "reset",
    "resize",
    "scroll",
    "seeked",
    "seeking",
    "select",
    "selectionchange",
    "selectstart",
    "slotchange",
    "stalled",
    "submit",
    "suspend",
    "timeupdate",
    "toggle",
    "touchcancel",
    "touchend",
    "touchmove",
    "touchstart",
    "transitioncancel",
    "transitionend",
    "transitionrun",
    "transitionstart",
    "volumechange",
    "waiting",
    "wheel",
] as (keyof HTMLElementEventMap)[]).forEach(name => {
    Component.prototype[`on${name}`] = function(callback: (event: Event) => any) {
        (this as Component).on(name, callback);
    }
});

export type ComponentCreateOutput = Component | HTMLElement | Slot<any>;