import { Item } from "./Item";

export interface Edge {
    parent: string;
    child: string;
    description?: string;
    parentItem?: Item;
    childItem?: Item;
}
