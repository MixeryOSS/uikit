import { UIKit } from "../UIKit.js";

export abstract class Component {
    abstract create(children: any[]): UIKit.KitInfo<any>;
}