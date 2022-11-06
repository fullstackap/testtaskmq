import React, { useCallback, useRef } from 'react';
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

const useStateWithCallbackLazy = (initialValue: any) => {
    const callbackRef = useRef<any>(null);

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (callbackRef.current) {
            callbackRef.current(value);

            callbackRef.current = null;
        }
    }, [value]);

    const setValueWithCallback = useCallback(
        (newValue: any, callback: any) => {
            callbackRef.current = callback;

            return setValue(newValue);
        },
        [],
    );

    return [value, setValueWithCallback];
};

function App() {
    const [db, setDB] = useState<IDBDatabase>();
    const [dbRequest, setDBRequest] = useState<any>();
    const [isInitiatingDB, setIsInitiatingDB] = useState(false);

    const [temperature, setTemperature] = useState<ItemData[]>([]);
    const [precipitation, setPrecipitation] = useState<ItemData[]>([]);

    const [displayData, setDisplayData] = useState<any>(TEMPERATURE);
    const [minYear, setMinYear] = useState<any>('');
    const [maxYear, setMaxYear] = useState<any>('');
    const [selectedMinYear, setSelectedMinYear] = useState<any>('');
    const [selectedMaxYear, setSelectedMaxYear] = useState<any>('');

    const [dataArr, setDataArr] = useStateWithCallbackLazy([]);
    const [uniqueYears, setUniqueYears] = useState<any>([]);

    const [hasCheckedForTemperatureData, setHasCheckedForTemperatureData] = useState(false);
    const [hasCheckedForPrecipitation, setHasCheckedForPrecipitation] = useState(false);

    const [isLoadingTemperature, setIsLoadingTemperature] = useState(false);
    const [isLoadingPrecipitation, setIsLoadingPrecipitation] = useState(false);

    const [isWritingTemperature, setIsWritingTemperature] = useState(false);
    const [isWritingPrecipitation, setIsWritingPrecipitation] = useState(false);

    const temperatureButtonRef = useRef<HTMLButtonElement>(null);
    const precipitationButtonRef = useRef<HTMLButtonElement>(null);

    const handleDisplayData = (displayDataP: any, dataArrP: any, selectedMinYearP: any, selectedMaxYearP: any) => {
        console.error("@handleDisplayData");

        setDataArr([], () => {
            // filter data against selected dropdown options - if selected
            const filteredDataArr = dataArrP?.filter((elem: ItemData) =>
                (!selectedMinYearP || Number(elem?.t?.split("-")[0]) >= Number(selectedMinYearP)) &&
                (!selectedMaxYearP || Number(elem?.t?.split("-")[0]) <= Number(selectedMaxYearP)));

            setDataArr(filteredDataArr);

            // collect all years
            const allYears = dataArrP?.map((elem: ItemData) => Number(elem?.t?.split("-")[0]));

            // remove duplicates, values to be used for the y axis line
            const uniqueYears: any = [...new Set(allYears)]?.sort();

            setUniqueYears(uniqueYears);

            // calculate the min (start) and max (end) years to be used for the dropdowns
            const minYearT = Math.min(...uniqueYears).toString();
            const maxYearT = Math.max(...uniqueYears).toString();

            setMinYear(minYearT);
            setMaxYear(maxYearT);

            setDisplayData(displayDataP);
        });
    };

    const setSelectedMinYearWrapper = (displayDataP: any, temperature: any, precipitation: any, selectedMinYearP: any, selectedMaxYearP: any) => {
        console.error("@setSelectedMinYearWrapper");

        setSelectedMinYear(selectedMinYearP);
        handleDisplayData(displayDataP, displayDataP === TEMPERATURE ? temperature : precipitation, selectedMinYearP, selectedMaxYearP)
    };

    const setSelectedMaxYearWrapper = (displayDataP: any, temperature: any, precipitation: any, selectedMinYearP: any, selectedMaxYearP: any) => {
        console.error("@setSelectedMaxYearWrapper");

        setSelectedMaxYear(selectedMaxYearP);
        handleDisplayData(displayDataP, displayDataP === TEMPERATURE ? temperature : precipitation, selectedMinYearP, selectedMaxYearP);
    };

    const setTemperatureWrapper = (data: any) => {
        console.error("@setTemperatureWrapper");

        if (!data?.length) {
            return;
        }

        setTemperature(data);

        if (displayData === TEMPERATURE) {
            handleDisplayData(displayData, data, selectedMinYear, selectedMaxYear);
        }
    };

    const setPrecipitationWrapper = (data: any) => {
        console.error("@setPrecipitationWrapper");

        if (!data?.length) {
            return;
        }
        setPrecipitation(data);

        if (displayData === PRECIPITATION) {
            handleDisplayData(displayData, data, selectedMinYear, selectedMaxYear);
        }
    };

    const setDBWrapper = (dbP: any, dbRequest: any) => {
        console.error("@setDBWrapper");

        setDB(dbP);
        setDBRequest(dbRequest);

        // check if data present in indexedDB and if so set the corresponding data state tables
        setHasCheckedForTemperatureData(true);
        readTableData(dbP, dbRequest, TEMPERATURE_TABLE, setTemperatureWrapper, setIsLoadingTemperature);

        setHasCheckedForPrecipitation(true);
        readTableData(dbP, dbRequest, PRECIPITATION_TABLE, setPrecipitationWrapper, setIsLoadingPrecipitation);
    };

    // get indexedDB object
    useEffect(() => {
        if (!db && !dbRequest && !isInitiatingDB) {
            initiateDB(setDBWrapper, setIsInitiatingDB);
        }
    }, []);

    // if data not present in indexedDB, load and write from local files, and the read to initiate the graph
    useEffect(() => {
        (async () => {
            const isTemperaturePendingRetrieval = db && dbRequest && !isInitiatingDB && (!temperature || temperature.length == 0) && hasCheckedForTemperatureData && !isWritingTemperature && !isLoadingTemperature;
            if (isTemperaturePendingRetrieval) {
                const temperatureT = await getData<ItemData>('../data/temperature.json');
                writeTableData(db, dbRequest, TEMPERATURE_TABLE, temperatureT, setIsWritingTemperature);
                readTableData(db, dbRequest, TEMPERATURE_TABLE, setTemperature, setIsLoadingTemperature);
            }

            const isPrecipitationPendingRetrieval = db && dbRequest && !isInitiatingDB && (!precipitation || precipitation.length == 0) && hasCheckedForPrecipitation && !isWritingPrecipitation && !isLoadingPrecipitation;
            if (isPrecipitationPendingRetrieval) {
                const precipitationT = await getData<ItemData>('../data/precipitation.json');
                writeTableData(db, dbRequest, PRECIPITATION_TABLE, precipitationT, setIsWritingPrecipitation);
                readTableData(db, dbRequest, PRECIPITATION_TABLE, setPrecipitation, setIsLoadingPrecipitation);
            }
        })();
    }, []);

    console.error({
        minYear, maxYear,
    })

    const isLoading = isLoadingTemperature || isLoadingPrecipitation;

    // construct menu items
    const yearOptions = [
        ...uniqueYears
            ?.map((value: any) => ({
                label: value,
                value,
            }))];

    return (
        <div style={{ margin: "0 auto", width: "1280px" }}>
            <div>
                <Button type="primary" size="large" id={TEMPERATURE} ref={temperatureButtonRef} onClick={() => handleDisplayData(TEMPERATURE, temperature, selectedMinYear, selectedMaxYear)}>
                    Temperature
                </Button>
            </div>

            <br />

            <div>
                <Button type="primary" size="large" id={PRECIPITATION} ref={precipitationButtonRef} onClick={() => handleDisplayData(PRECIPITATION, precipitation, selectedMinYear, selectedMaxYear)}>
                    Precipitation
                </Button>
            </div>

            <br />

            <div>
                <Select
                    isLoading={isLoading}
                    options={yearOptions}
                    defaultValue={{ label: minYear, value: minYear }}
                    onChange={(elem: any) => setSelectedMinYearWrapper(displayData, temperature, precipitation, elem.value, selectedMaxYear)} />
            </div>

            <br />

            <div>
                <Select
                    isLoading={isLoading}
                    options={yearOptions}
                    defaultValue={{ label: maxYear, value: maxYear }}
                    onChange={(elem: any) => setSelectedMaxYearWrapper(displayData, temperature, precipitation, selectedMinYear, elem.value)} />
            </div>

            <br />

            <div style={{ border: "1px solid grey", width: "1280px", height: "1280px" }}>
                {!isLoading && dataArr.length > 0 ?
                    <CanvasWrapper dataArr={dataArr} yAxisName={displayData} /> :
                    < div style={{ margin: "640px auto", width: "100px", }}><h1>GRAPH</h1></div>
                }
            </div>
        </div >
    );
}


export default App;