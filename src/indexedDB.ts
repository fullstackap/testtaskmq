import { DB, LIMIT_RECORDS, PRECIPITATION_TABLE, TEMPERATURE_TABLE } from './constants';
import PrecipitationService from './services/precipitation.service';
import ServiceCalls from './services/service.calls';
import TemperatureService from './services/temperature.service';
import type { ItemData } from './types';

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

class IndexedDB {
    temperatureServiceCallsSvc: ServiceCalls;
    precipitationServiceCallsSvc: ServiceCalls;

    constructor() {
        this.temperatureServiceCallsSvc = new ServiceCalls(new TemperatureService());
        this.precipitationServiceCallsSvc = new ServiceCalls(new PrecipitationService());
    }


    // createTableWrapper creates the tableName collection
    createTableWrapper(db: any, tableName: string) {
        try {
            // db.deleteObjectStore(tableName);

            if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName, { autoIncrement: true });
            }
        } catch (err) {
            console.error({ function: "IndexedDB.initiateDB", err });
        }
    }

    // initiateDB creates a db connection to indexedDB and creates collections if not already present
    initiateDB(displayDataP: any, setDBWrapper: any, setIsInitiatingDB: any) {
        try {
            setIsInitiatingDB(true);

            const request = window.indexedDB.open(DB, 1);

            request.onerror = (event: any) => {
                console.error("failed to initiate indexedDB", event);
            }

            request.onsuccess = (event: any) => {
                const dbT = request.result;
                if (dbT.objectStoreNames.contains(TEMPERATURE_TABLE) || dbT.objectStoreNames.contains(PRECIPITATION_TABLE)) {

                    setIsInitiatingDB(false);
                    setDBWrapper(displayDataP, dbT, request);
                }
            }

            request.onupgradeneeded = (event: any) => {
                var db = event.target.result;
                this.createTableWrapper(db, TEMPERATURE_TABLE);
                this.createTableWrapper(db, PRECIPITATION_TABLE);

                setIsInitiatingDB(false);
                setDBWrapper(displayDataP, db, request);
            }
        } catch (err) {
            console.error({ function: "IndexedDB.initiateDB", err });
            setIsInitiatingDB(false);
        }
    }

    // readTableData reads data from indexedDB, if data is not present then it fetching it from remote db
    readTableData(displayDataP: any, db: any, tableName: string, setData: any, setIsLoading: any) {
        try {
            setIsLoading(true);

            const transaction = db.transaction([tableName]);
            const objectStore = transaction.objectStore(tableName);
            const request = objectStore.getAll();

            request.onerror = (event: any) => {
                console.error(`failed to fetch ${tableName} data`);
            };

            request.onsuccess = async (event: any) => {
                let dataT = event?.target?.result;

                // REQUIRMENT: при отсутствии данных в таблице, данные для нее запрашиваются с сервера
                // REQUIRMENT: данные с сервера запрашиваются по требованию, когда произошло обращение за соответствующими данными в локальную базу данных и они в ней не найдены
                if (dataT && dataT?.length === 0) {
                    if (tableName == TEMPERATURE_TABLE) {
                        const resOne: any = await this.temperatureServiceCallsSvc.getAll(0, 1);
                        if (resOne && resOne?.count > 0) {
                            let offset = 0;
                            for (let i = 0; i < resOne?.count; i = i + LIMIT_RECORDS) {
                                const resAll: any = await this.temperatureServiceCallsSvc.getAll(offset, LIMIT_RECORDS);
                                dataT = [...dataT, ...resAll?.items];
                                offset = offset + LIMIT_RECORDS;
                            }
                        }
                    } else if (tableName == PRECIPITATION_TABLE) {
                        const resOne: any = await this.precipitationServiceCallsSvc.getAll(0, 1);
                        if (resOne && resOne?.count > 0) {
                            let offset = 0;
                            for (let i = 0; i < resOne?.count; i = i + LIMIT_RECORDS) {
                                const resAll: any = await this.precipitationServiceCallsSvc.getAll(offset, LIMIT_RECORDS);
                                dataT = [...dataT, ...resAll?.items];
                                offset = offset + LIMIT_RECORDS;
                            }
                        }
                    }

                    this.writeTableData(db, tableName, dataT);
                }

                setData(displayDataP, dataT);
                setIsLoading(false);
            };

        } catch (err) {
            console.error({ function: "IndexedDB.readTableData", err, tableName });
            setData([]);
            setIsLoading(false);
        }
    }

    // writeTableData writes data to indexedDB
    writeTableData(db: any, tableName: string, data: ItemData[]) {
        try {
            const objectStore = db.transaction(tableName, "readwrite").objectStore(tableName);
            for (let i in data) {
                objectStore.add({ id: `${(i + 1)}`, t: data[i].t.split("T")[0], v: data[i].v });
            }
        } catch (err) {
            console.error({ function: "IndexedDB.writeTableData", err });
        }
    }
}

export default IndexedDB;