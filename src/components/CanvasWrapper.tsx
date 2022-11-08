import { useEffect, useRef } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH, GRAPH_BOTTOM, GRAPH_HEIGHT, GRAPH_LEFT, GRAPH_RIGHT, GRAPH_TOP, GRAPH_WIDTH, PRECIPITATION, TEMPERATURE } from '../constants';
import type { ItemData } from '../types';

const updateMaxCtx = (ctx: any, yAxisName: string, xCoord: number, yCoord: number, value: number) => {
    const v = value.toFixed(2).toString();
    const t = yAxisName === TEMPERATURE ? `${v} C°` : `${v} %`;

    // draw reference value 
    ctx.fillText(t, xCoord, yCoord);
    ctx.stroke();
    ctx.save();

    ctx.lineWidth = 1;
    ctx.save();
}

const updateCtx = (ctx: any, yAxisName: string, xCoord: number, yCoord: number, value: number) => {
    // draw reference line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(GRAPH_LEFT, yCoord);
    ctx.lineTo(GRAPH_RIGHT, yCoord);

    if (value == 0) {
        ctx.lineWidth = 3;
    }

    const v = value.toFixed(2).toString();
    const t = yAxisName === TEMPERATURE ? `${v} C°` : `${v} %`;

    // draw reference value 
    ctx.fillText(t, xCoord, yCoord);
    ctx.stroke();
    ctx.save();

    ctx.lineWidth = 1;
    ctx.save();
}

const CanvasWrapper = ({ dataArr, yAxisName }: any) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    useEffect(() => {
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext('2d');

            const ctx = canvasCtxRef.current;
            if (ctx) {
                const arrayLen = dataArr?.length;

                // get all filtered years in one array
                const allYears = dataArr?.map((elem: ItemData) => Number(elem?.t?.split("-")[0]));

                // get all filtered unique years in one array
                const uniqueYears: any = [...new Set(allYears)];

                // get all values in one array
                const allValues = dataArr?.map((elem: ItemData) => elem?.v);

                const minYear = uniqueYears?.length > 0 ? Math.min(...uniqueYears) : 0;
                const maxYear = uniqueYears?.length > 0 ? Math.max(...uniqueYears) : 0;

                const minValue = allValues?.length > 0 ? Math.min(...allValues) : 0;
                const maxValue = allValues?.length > 0 ? Math.max(...allValues) : 0;

                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                ctx.font = "18px Arial";

                const GRAPH_BOTTOM_EXT = yAxisName === PRECIPITATION ? GRAPH_BOTTOM - 25 : GRAPH_BOTTOM;
                const GRAPH_HEIGHT_EXT = yAxisName === PRECIPITATION ? GRAPH_HEIGHT - 25 : GRAPH_HEIGHT;

                // draw X and Y axis  
                ctx.beginPath();
                ctx.moveTo(GRAPH_LEFT, GRAPH_BOTTOM_EXT);
                ctx.lineTo(GRAPH_RIGHT, GRAPH_BOTTOM_EXT); // x axis
                ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP); // y axis
                ctx.stroke();

                // draw reference line  
                ctx.beginPath();
                ctx.strokeStyle = "#bbbbbb";
                ctx.moveTo(GRAPH_LEFT, GRAPH_TOP);
                ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP);
                ctx.stroke();

                const xCoord = GRAPH_RIGHT + 15;

                const groundZero = (minValue < 0 ? GRAPH_HEIGHT_EXT / 2 : GRAPH_HEIGHT_EXT);

                // draw 1st reference line and value
                updateCtx(ctx, yAxisName, xCoord, GRAPH_HEIGHT_EXT, 0);

                // draw 1st reference line and value
                const firstYCoordMax = groundZero * (3 / 4);
                updateCtx(ctx, yAxisName, xCoord, firstYCoordMax, maxValue / 4);

                // draw 2nd reference line and value
                const secondYCoordMax = groundZero / 2;
                updateCtx(ctx, yAxisName, xCoord, secondYCoordMax, maxValue / 2);

                // draw 3rd reference line and value
                const thirdYCoordMax = groundZero / 4;
                updateCtx(ctx, yAxisName, xCoord, thirdYCoordMax, maxValue * (3 / 4));

                // draw 4th reference line and value
                const fourthYCoordMax = GRAPH_TOP + 15;
                updateMaxCtx(ctx, yAxisName, xCoord, fourthYCoordMax, maxValue);

                if (minValue < 0) {
                    // draw 1st reference line and value
                    updateCtx(ctx, yAxisName, xCoord, groundZero, 0);

                    // draw 2nd reference line and value
                    const firstYCoordMin = groundZero / 4 + groundZero;
                    updateCtx(ctx, yAxisName, xCoord, firstYCoordMin, minValue / 4);

                    // draw 3rd reference line and value
                    const secondYCoordMin = groundZero / 2 + groundZero;
                    updateCtx(ctx, yAxisName, xCoord, secondYCoordMin, minValue / 2);

                    // draw 3rd reference line   and value
                    const thirdYCoordMin = groundZero * (3 / 4) + groundZero;
                    updateCtx(ctx, yAxisName, xCoord, thirdYCoordMin, minValue * (3 / 4));

                    const fourthYCoordMin = groundZero + groundZero;
                    updateCtx(ctx, yAxisName, xCoord, fourthYCoordMin, minValue);
                }

                // draw x title 
                ctx.fillText("Годы", (GRAPH_BOTTOM_EXT + 25) / 2, GRAPH_BOTTOM_EXT + 80);

                // draw y title  
                ctx.fillText(yAxisName, GRAPH_RIGHT + 90, GRAPH_HEIGHT_EXT / 2);

                // draw y points
                ctx.beginPath();
                ctx.lineJoin = "round";
                ctx.strokeStyle = "#1890ff";

                for (let i = 1; i < arrayLen; i++) {
                    const x = GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT;
                    let y = dataArr[i].v >= 0 ? groundZero + dataArr[i].v / maxValue * groundZero : groundZero - dataArr[i].v / minValue * groundZero;
                    if (yAxisName === PRECIPITATION) {
                        y = groundZero - dataArr[i].v / maxValue * groundZero;
                    }

                    ctx.lineTo(x, y);
                }

                // draw x points
                const left = 0;
                const diff = maxYear - minYear;
                ctx.fillText(uniqueYears[0], left, GRAPH_BOTTOM_EXT + 35);
                if (diff > 3) ctx.fillText(uniqueYears[Math.floor(uniqueYears.length / 5)], left + ((GRAPH_BOTTOM + 100) / 5), GRAPH_BOTTOM_EXT + 35);
                if (diff > 1) ctx.fillText(uniqueYears[Math.floor(uniqueYears.length / 2)], left + (GRAPH_BOTTOM / 2), GRAPH_BOTTOM_EXT + 35);
                if (diff > 3) ctx.fillText(uniqueYears[Math.floor(uniqueYears.length / (4 / 3))], left + ((GRAPH_BOTTOM + 25) / (4 / 3)), GRAPH_BOTTOM_EXT + 35);
                ctx.fillText(uniqueYears[uniqueYears.length - 1], left + (GRAPH_BOTTOM + 25), GRAPH_BOTTOM_EXT + 35);

                ctx.stroke();
            }
        }
    }, []);

    return <canvas style={{ padding: "50px" }} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />
}

export default CanvasWrapper;
