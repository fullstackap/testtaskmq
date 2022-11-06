import { useEffect, useRef } from 'react';
import type { ItemData } from './types';

const GRAPH_TOP = 0;
const GRAPH_BOTTOM = 675;

const GRAPH_LEFT = 0;
const GRAPH_RIGHT = 825;

const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 675;

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

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

                // set font for fillText()  
                ctx.font = "16px Arial";

                const GRAPH_BOTTOM_EXT = yAxisName === "Осадки" ? GRAPH_BOTTOM - 25 : GRAPH_BOTTOM;
                const GRAPH_HEIGHT_EXT = yAxisName === "Осадки" ? GRAPH_HEIGHT - 25 : GRAPH_HEIGHT;

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

                const updateCtx = (yCoord: number, value: number) => {
                    // draw reference line
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(GRAPH_LEFT, yCoord);
                    ctx.lineTo(GRAPH_RIGHT, yCoord);

                    if (value == 0) {
                        ctx.lineWidth = 3;
                    }

                    // draw reference value 
                    ctx.fillText(value.toFixed(2).toString(), xCoord, yCoord);
                    ctx.stroke();
                    ctx.save();

                    ctx.lineWidth = 1;
                    ctx.save();
                }

                const groundZero = (minValue < 0 ? GRAPH_HEIGHT_EXT / 2 : GRAPH_HEIGHT_EXT);

                // draw 1st reference line and value
                const firstYCoordMax = groundZero * (3 / 4);
                updateCtx(firstYCoordMax, maxValue / 4);

                // draw 2nd reference line and value
                const secondYCoordMax = groundZero / 2;
                updateCtx(secondYCoordMax, maxValue / 2);

                // draw 3rd reference line and value
                const thirdYCoordMax = groundZero / 4;
                updateCtx(thirdYCoordMax, maxValue * (3 / 4));

                // draw 4th reference line and value
                const fourthYCoordMax = GRAPH_TOP;
                updateCtx(fourthYCoordMax, maxValue);

                // console.error({
                //     groundZero, firstYCoordMax, secondYCoordMax, thirdYCoordMax, fourthYCoordMax
                // })

                if (minValue < 0) {
                    // draw 2nd reference line and value
                    updateCtx(groundZero, 0);

                    // draw 1st reference line and value
                    const firstYCoordMin = groundZero / 4 + groundZero;
                    updateCtx(firstYCoordMin, minValue / 4);

                    // draw 2nd reference line and value
                    const secondYCoordMin = groundZero / 2 + groundZero;
                    updateCtx(secondYCoordMin, minValue / 2);

                    // draw 3rd reference line   and value
                    const thirdYCoordMin = groundZero * (3 / 4) + groundZero;
                    updateCtx(thirdYCoordMin, minValue * (3 / 4));

                    const fourthYCoordMin = groundZero + groundZero;
                    updateCtx(fourthYCoordMin, minValue);

                    // console.error({
                    //     groundZero, firstYCoordMin, secondYCoordMin, thirdYCoordMin, fourthYCoordMin
                    // })
                }

                // console.error({
                //     minValue, maxValue
                // })

                // draw titles  
                ctx.fillText("Годы", GRAPH_WIDTH / 2, GRAPH_BOTTOM_EXT + 80);
                ctx.fillText(yAxisName, GRAPH_RIGHT + 80, GRAPH_HEIGHT_EXT / 2);

                ctx.beginPath();
                ctx.lineJoin = "round";
                ctx.strokeStyle = "grey";

                if (arrayLen > 0) {
                    ctx.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT_EXT - dataArr[0] / (maxValue - minValue) * GRAPH_HEIGHT_EXT) + GRAPH_TOP);
                }

                // console.error({
                //     minValue, maxValue
                // })

                for (let i = 1; i < arrayLen; i++) {
                    // context.lineTo( GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, ( GRAPH_HEIGHT_EXT - dataArr[ i ] / largest * GRAPH_HEIGHT_EXT ) + GRAPH_TOP );  

                    const x = GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT;
                    let y = dataArr[i].v >= 0 ? groundZero + dataArr[i].v / maxValue * groundZero : groundZero - dataArr[i].v / minValue * groundZero;
                    if (yAxisName === "Осадки") {
                        y = groundZero - dataArr[i].v / maxValue * groundZero;
                    }
                    ctx.lineTo(x, y);

                    // console.error({ GRAPH_RIGHT, arrayLen, i, GRAPH_LEFT, x, y, v: dataArr[i].v });

                    // if (i == 5) {
                    //     break;
                    // }
                }

                // renderData(ctx);

                const left = 0;
                const diff = maxYear - minYear;

                ctx.fillText(uniqueYears[0], left, GRAPH_BOTTOM_EXT + 35);
                if (diff > 4) ctx.fillText(uniqueYears[Math.floor(uniqueYears.length / 5)], left + (GRAPH_WIDTH / 5), GRAPH_BOTTOM_EXT + 35);
                if (diff > 2) ctx.fillText(uniqueYears[Math.floor(uniqueYears.length / 2)], left + (GRAPH_WIDTH / 2), GRAPH_BOTTOM_EXT + 35);
                if (diff > 4) ctx.fillText(uniqueYears[Math.floor(uniqueYears.length / (4 / 3))], left + (GRAPH_WIDTH / (4 / 3)), GRAPH_BOTTOM_EXT + 35);
                ctx.fillText(uniqueYears[uniqueYears.length - 1], left + (GRAPH_WIDTH / 1), GRAPH_BOTTOM_EXT + 35);

                ctx.stroke();
            }
        }
    }, []);

    return <canvas style={{ padding: "50px" }} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />
}

export default CanvasWrapper;
