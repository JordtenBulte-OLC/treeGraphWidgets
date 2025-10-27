import { ReactElement, createElement, Fragment } from "react";
import { Bezier } from "../models/Bezier";

export interface ScreenPathProps {
    bezier: Bezier;
    lineStroke: string;
    lineWidth: string;
    lineColor: string;
    lineType: string;
    hSpacing: number | null;
    vSpacing: number | null;
}

const ScreenBezier = (props: ScreenPathProps): ReactElement => {
    const { start, end, controlStart, controlEnd } = props.bezier;
    const hSpacing = props.hSpacing ?? 0;

    let bezierPath: string;

    if (props.lineType === "square") {
        // Z-shaped path: horizontal to mid-X, vertical to end-Y, horizontal to end-X
        const midX = start.x + (hSpacing / 2);
        bezierPath = `M ${start.x}, ${start.y} L ${midX}, ${start.y} L ${midX}, ${end.y} L ${end.x}, ${end.y}`;

    } else if (!!controlStart && !!controlEnd) {
        // Draw a curved bezier path
        bezierPath = `M ${start.x}, ${start.y} C ${controlStart.x}, ${controlStart.y} ${controlEnd.x}, ${controlEnd.y} ${end.x}, ${end.y}`;
    } else {
        // Draw a straight line
        bezierPath = `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;
    }

    console.info({"bezier": props.bezier});

    return (
        <Fragment>
            <path
                d={bezierPath}
                fill="transparent"
                markerEnd="url(#arrowhead)"
                strokeDasharray={props.lineStroke}
                strokeWidth={props.lineWidth}
                stroke={props.lineColor}
                strokeLinecap="round"
            />
            <text x={end.x} y={end.y} dx={-48} dy={-8}>{props.bezier.description?.toString()}</text>
        </Fragment>
    );
};

export default ScreenBezier;