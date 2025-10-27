import { generateBeziers } from "./BezierUtils";
import { Item } from "../models/Item";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { WidgetTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import { ItemLayout } from "../models/ItemLayout";
import { LineLayout } from "../models/LineLayout";
import ItemsFactory from "../models/ItemsFactory/ItemsFactory";
import OrgChartItemsFactory from "../models/ItemsFactory/OrgChartItemsFactory";
import PertChartItemsFactory from "../models/ItemsFactory/PertChartItemsFactory";
import TreeListItemsFactory from "../models/ItemsFactory/TreeListItemsFactory";

export const createItems = (
    currentItems: Item[],
    dataMicroflow: ListValue,
    self: ListAttributeValue<string>,
    hasFocus: ListAttributeValue<boolean>,
    boxContent: ListWidgetValue,
    dimensions: ItemLayout,
    widgetType: WidgetTypeEnum,
    dataMicroflowEdge?: ListValue,
    parent?: ListAttributeValue<string>,
    parentEdge?: ListAttributeValue<string>,
    childEdge?: ListAttributeValue<string>,
    showsChildren?: ListAttributeValue<boolean>,
    column?: ListAttributeValue<Big>,
    bezierDescription?: ListAttributeValue<string | boolean | Big | Date>
): Item[] => {

    let itemsFactory: ItemsFactory;
    console.info({ dataMicroflowEdge });
    console.info({ bezierDescription });
    switch (widgetType) {
        case "organogram":
            itemsFactory = new OrgChartItemsFactory(
                dataMicroflow.items!,
                self,
                hasFocus,
                boxContent,
                parent!,
                showsChildren!
            );
            break;
        case "pert":
            itemsFactory = new PertChartItemsFactory(
                dataMicroflow.items!,
                self,
                hasFocus,
                boxContent!,
                column!,
                dataMicroflowEdge?.items!,
                parentEdge!,
                childEdge!,
                bezierDescription
            );
            break;
        case "tree":
            itemsFactory = new TreeListItemsFactory(
                dataMicroflow.items!,
                self,
                hasFocus,
                boxContent,
                parent!,
                showsChildren!
            );
            break;
        default:
            throw new Error(`Unsupported widgetType: ${widgetType}`);
    };

    return itemsFactory.execute(
        currentItems,
        dimensions
    );


};

export const createBeziers = (
    widgetType: WidgetTypeEnum,
    items: Item[],
    itemLayout: ItemLayout,
    lineLayout: LineLayout
) => {
    if (widgetType === "tree") {
        return [];
    }

    console.info({ items });
    console.info({ itemLayout });
    console.info({ lineLayout });

    return generateBeziers(items, itemLayout, lineLayout, widgetType);
};
