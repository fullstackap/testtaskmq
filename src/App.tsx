import React, { useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import { getData } from './utils';
import type { ItemData } from './types';
import Select from 'react-select'
import { Button, Col, Row } from 'antd';
import 'antd/dist/antd.css'
import CanvasWrapper from './components/CanvasWrapper';
import { PRECIPITATION, PRECIPITATION_TABLE, TEMPERATURE, TEMPERATURE_TABLE } from './constants';
import useStateWithCallback from './useStateWithCallback';
import IndexedDB from './indexedDB';

const indexedDBSvc = new IndexedDB();

const getMenuOptions = (label = "Select Year", uniqueYears: any) => [
    { label, value: "" },
    ...uniqueYears
        ?.map((value: any) => ({
            label: value,
            value,
        }))];

const App = () => {
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

    const [dataArr, setDataArr] = useStateWithCallback([]);
    const [uniqueYears, setUniqueYears] = useState<any>([]);

    const [isLoadingTemperature, setIsLoadingTemperature] = useState(false);
    const [isLoadingPrecipitation, setIsLoadingPrecipitation] = useState(false);

    const temperatureButtonRef = useRef<HTMLButtonElement>(null);
    const precipitationButtonRef = useRef<HTMLButtonElement>(null);

    const handleDisplayData = (displayDataP: any, dataArrP: any, selectedMinYearP: any, selectedMaxYearP: any) => {
        try {
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
        } catch (err) {
            console.error({ function: "handleDisplayData", err });
        }
    };

    const setSelectedMinYearWrapper = (displayDataP: any, temperature: any, precipitation: any, selectedMinYearP: any, selectedMaxYearP: any) => {
        try {
            console.error("@setSelectedMinYearWrapper");

            setSelectedMinYear(selectedMinYearP);
            handleDisplayData(displayDataP, displayDataP === TEMPERATURE ? temperature : precipitation, selectedMinYearP, selectedMaxYearP);
        } catch (err) {
            console.error({ function: "setSelectedMinYearWrapper", err });
        }
    };

    const setSelectedMaxYearWrapper = (displayDataP: any, temperature: any, precipitation: any, selectedMinYearP: any, selectedMaxYearP: any) => {
        try {
            console.error("@setSelectedMaxYearWrapper");

            setSelectedMaxYear(selectedMaxYearP);
            handleDisplayData(displayDataP, displayDataP === TEMPERATURE ? temperature : precipitation, selectedMinYearP, selectedMaxYearP);
        } catch (err) {
            console.error({ function: "setSelectedMaxYearWrapper", err });
        }
    };

    const setTemperatureWrapper = (data: any) => {
        try {
            console.error("@setTemperatureWrapper");

            if (!data?.length) {
                return;
            }

            setTemperature(data);

            handleDisplayData(TEMPERATURE, data, selectedMinYear, selectedMaxYear);

        } catch (err) {
            console.error({ function: "setTemperatureWrapper", err });
        }
    };

    const setPrecipitationWrapper = (data: any) => {
        try {
            console.error("@setPrecipitationWrapper");

            if (!data?.length) {
                return;
            }

            setPrecipitation(data);

            handleDisplayData(PRECIPITATION, data, selectedMinYear, selectedMaxYear);
        } catch (err) {
            console.error({ function: "setPrecipitationWrapper", err });
        }
    };

    const setDBWrapper = (dbP: any, dbRequest: any) => {
        try {
            console.error("@setDBWrapper");

            setDB(dbP);
            setDBRequest(dbRequest);

            // read temperature data from indexedDB and if so set the corresponding data state tables
            indexedDBSvc.readTableData(dbP, TEMPERATURE_TABLE, setTemperatureWrapper, setIsLoadingTemperature);

            // read precipitation data from indexedDB and if so set the corresponding data state tables
            indexedDBSvc.readTableData(dbP, PRECIPITATION_TABLE, setPrecipitationWrapper, setIsLoadingPrecipitation);
        } catch (err) {
            console.error({ function: "setDBWrapper", err });
        }
    };

    // get indexedDB object
    useEffect(() => {
        if (!db && !dbRequest && !isInitiatingDB) {
            indexedDBSvc.initiateDB(setDBWrapper, setIsInitiatingDB);
        }
    }, []);

    const isLoading = isLoadingTemperature || isLoadingPrecipitation;

    // construct menu items
    return (
        <div style={{ margin: "0 auto", width: "1600px" }}>
            <h1>Архив Метеослужбы</h1>
            <div className="row">
                <div className="leftcolumn">
                    <div className="card">
                        <div>
                            <Button type="primary" className="full-width-btn" size="large" id={TEMPERATURE} ref={temperatureButtonRef} onClick={() => handleDisplayData(TEMPERATURE, temperature, selectedMinYear, selectedMaxYear)}>
                                Температура
                            </Button>
                        </div>

                        <br />

                        <div>
                            <Button type="primary" className="full-width-btn" size="large" id={PRECIPITATION} ref={precipitationButtonRef} onClick={() => handleDisplayData(PRECIPITATION, precipitation, selectedMinYear, selectedMaxYear)}>
                                Осадки
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="rightcolumn">
                    <div className="card row">
                        <div className="column">
                            {!isLoading ? <Select
                                className="dropdown"
                                options={getMenuOptions("Select Start Year", uniqueYears)}
                                defaultValue={{ label: minYear, value: minYear }}
                                onChange={(elem: any) => setSelectedMinYearWrapper(displayData, temperature, precipitation, elem.value, selectedMaxYear)}
                            /> : <p>Loading Start Years... Please wait!</p>}
                        </div>
                        <div className="column">
                            {!isLoading ? <Select
                                className="dropdown"
                                options={getMenuOptions("Select End Year", uniqueYears)}
                                defaultValue={{ label: maxYear, value: maxYear }}
                                onChange={(elem: any) => setSelectedMaxYearWrapper(displayData, temperature, precipitation, selectedMinYear, elem.value)}
                            /> : <p>Loading End Years... Please wait!</p>}
                        </div>
                    </div>
                    <div className="card">
                        <div>
                            {!isLoading && dataArr.length > 0 ?
                                <CanvasWrapper dataArr={dataArr} yAxisName={displayData} /> :
                                < div style={{ margin: "640px auto", width: "100px", }}><h1>График</h1></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}


export default App;