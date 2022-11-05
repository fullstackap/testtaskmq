import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { getData } from './utils';
import type { ItemData } from './types';
import Select from 'react-select'
import { Button } from 'antd';
import 'antd/dist/antd.css'
import CanvasWrapper from './CanvasWrapper';
import { initiateDB, PRECIPITATION_TABLE, readTableData, TEMPERATURE_TABLE, writeTableData } from './indexedDB';

const TEMPERATURE = "Temperature";
const PRECIPITATION = "Precipitation";

// prefixes of implementation that we want to test
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// //prefixes of window.IDB objects
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const CanvasTemperature = ({ dataArr, yAxisName }: any) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    return <CanvasWrapper dataArr={dataArr} yAxisName={yAxisName} canvasRef={canvasRef} canvasCtxRef={canvasCtxRef} />
}

const CanvasPrecipitation = ({ dataArr, yAxisName }: any) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    return <CanvasWrapper dataArr={dataArr} yAxisName={yAxisName} canvasRef={canvasRef} canvasCtxRef={canvasCtxRef} />
}

function App() {
    const [db, setDB] = useState<IDBDatabase>();
    const [dbRequest, setDBRequest] = useState<any>();
    const [isInitiatingDB, setIsInitiatingDB] = useState(false);

    const [temperature, setTemperature] = useState<ItemData[]>([]);
    const [precipitation, setPrecipitation] = useState<ItemData[]>([]);

    const [displayData, setDisplayData] = useState<any>(TEMPERATURE);
    const [selectedMinYear, setSelectedMinYear] = useState<any>('');
    const [selectedMaxYear, setSelectedMaxYear] = useState<any>('');

    const [hasCheckedForTemperatureData, setHasCheckedForTemperatureData] = useState(false);
    const [hasCheckedForPrecipitation, setHasCheckedForPrecipitation] = useState(false);

    const [isLoadingTemperature, setIsLoadingTemperature] = useState(false);
    const [isLoadingPrecipitation, setIsLoadingPrecipitation] = useState(false);

    const [isWritingTemperature, setIsWritingTemperature] = useState(false);
    const [isWritingPrecipitation, setIsWritingPrecipitation] = useState(false);

    const setTemperatureWrapper = (data: any) => {
        console.error("@setTemperatureWrapper");

        console.error({ data })
        if (!data?.length) {
            return;
        }
        console.error({ data })
        setTemperature(data);
    }

    const setPrecipitationWrapper = (data: any) => {
        console.error("@setPrecipitationWrapper");

        if (!data?.length) {
            return;
        }
        setPrecipitation(data);
    }

    const setDBWrapper = (dbP: any, dbRequest: any) => {
        console.error("@setDBWrapper");

        setDB(dbP);
        setDBRequest(dbRequest);

        // check if data present in indexedDB and if so set the corresponding data state tables
        setHasCheckedForTemperatureData(true);
        readTableData(dbP, dbRequest, TEMPERATURE_TABLE, setTemperatureWrapper, setIsLoadingTemperature);

        setHasCheckedForPrecipitation(true);
        readTableData(dbP, dbRequest, PRECIPITATION_TABLE, setPrecipitationWrapper, setIsLoadingPrecipitation);
    }

    // get indexedDB object
    useEffect(() => {
        if (!db && !dbRequest && !isInitiatingDB) {
            initiateDB(setDBWrapper, setIsInitiatingDB);
        }
    }, []);

    // if data not present in indexedDB, load and write from local files, and the read to initiate the graph
    useEffect(() => {
        (async () => {
            if (db && dbRequest && !isInitiatingDB && (!temperature || temperature.length == 0) && hasCheckedForTemperatureData && !isWritingTemperature && !isLoadingTemperature) {
                const temperature = await getData<ItemData>('../data/temperature.json');
                writeTableData(db, dbRequest, TEMPERATURE_TABLE, temperature, setIsWritingTemperature);
                readTableData(db, dbRequest, TEMPERATURE_TABLE, setTemperature, setIsLoadingTemperature);
            }
            if (db && dbRequest && !isInitiatingDB && (!precipitation || precipitation.length == 0) && hasCheckedForPrecipitation && !isWritingPrecipitation && !isLoadingPrecipitation) {
                setPrecipitation(await getData<ItemData>('../data/precipitation.json'));
                writeTableData(db, dbRequest, PRECIPITATION_TABLE, precipitation, setIsWritingPrecipitation);
                readTableData(db, dbRequest, PRECIPITATION_TABLE, setPrecipitation, setIsLoadingPrecipitation);
            }
        })();
    }, []);

    const isLoading = isLoadingTemperature || isLoadingPrecipitation;

    // switch between data feeds
    const dataArr = (displayData == TEMPERATURE ? temperature : precipitation);

    // filter data against selected dropdown options - if selected
    const filteredDataArr =
        dataArr?.filter((elem: ItemData) =>
            (!selectedMinYear || Number(elem?.t?.split("-")[0]) >= Number(selectedMinYear)) &&
            (!selectedMaxYear || Number(elem?.t?.split("-")[0]) <= Number(selectedMaxYear)));

    // collect all years
    const allYears = dataArr?.map((elem: ItemData) => Number(elem?.t?.split("-")[0]));

    // remove duplicates, values to be used for the y axis line
    const uniqueYears = [...new Set(allYears)]?.sort();

    // calculate the min (start) and max (end) years to be used for the dropdowns
    const minYear = isLoading ? '' : Math.min(...uniqueYears).toString();
    const maxYear = isLoading ? '' : Math.max(...uniqueYears).toString();

    console.error({
        temperature, precipitation, minYear, maxYear
    })

    // construct menu items
    const yearOptions = isLoading ? [{ label: '', value: '' }] :
        [...uniqueYears
            ?.map((value: any) => ({
                label: value,
                value,
            }))];

    return (
        <div style={{ margin: "0 auto", width: "1280px" }}>
            <div>
                <Button type="primary" size="large" onClick={() => setDisplayData(TEMPERATURE)}>
                    Temperature
                </Button>
            </div>

            <br />

            <div>
                <Button type="primary" size="large" onClick={() => setDisplayData(PRECIPITATION)}>
                    Precipitation
                </Button>
            </div>

            <br />

            <div>
                <Select
                    isLoading={isLoading}
                    options={yearOptions}
                    defaultValue={{ label: minYear, value: minYear }}
                    onChange={(elem: any) => setSelectedMinYear(elem.value)} />
            </div>

            <br />

            <div>
                <Select
                    isLoading={isLoading}
                    options={yearOptions}
                    defaultValue={{ label: maxYear, value: maxYear }}
                    onChange={(elem: any) => setSelectedMaxYear(elem.value)} />
            </div>

            <br />

            <div style={{ border: "1px solid grey", width: "1280px", height: "1280px" }}>
                {!isLoading && displayData == TEMPERATURE && <CanvasTemperature dataArr={filteredDataArr} yAxisName={displayData} />}
                {!isLoading && displayData == PRECIPITATION && <CanvasPrecipitation dataArr={filteredDataArr} yAxisName={displayData} />}
                {(!isLoading || !displayData) && <div style={{ margin: "640px auto", width: "100px", }}><h1>GRAPH</h1></div>}
            </div>
        </div>
    );
}

export default App;
