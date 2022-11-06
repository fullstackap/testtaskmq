import type { ItemData } from './types';

export const DB = "weather_service_archive";
export const TEMPERATURE_TABLE = "temperature";
export const PRECIPITATION_TABLE = "precipitation";

// prefixes of implementation that we want to test
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// //prefixes of window.IDB objects
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const createTableWrapper = (db: any, dbRequest: any, tableName: string) => {
    // db.deleteObjectStore(tableName);

    if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { autoIncrement: true });
    }
}

export const initiateDB = (setDBWrapper: any, setIsInitiatingDB: any) => {
    try {
        console.error("@initiateDB");

        setIsInitiatingDB(true);

        const request = window.indexedDB.open(DB, 1);

        request.onerror = (event: any) => {
            console.error("initiateDB error");
        };

        request.onsuccess = (event: any) => {
            const dbT = request.result;
            setDBWrapper(dbT, request);
            setIsInitiatingDB(false);
            console.error("initiateDB success: " + dbT);
        }

        request.onupgradeneeded = (event: any) => {
            var db = event.target.result;

            createTableWrapper(db, request, TEMPERATURE_TABLE);
            createTableWrapper(db, request, PRECIPITATION_TABLE);

            console.error("initiateDB onupgradeneeded: " + db);
        }
    } catch (err) {
        console.error({ function: "initiateDB", err });

        setIsInitiatingDB(false);
    }
}

export const writeTableData = (db: any, dbRequest: any, tableName: string, data: ItemData[], setIsWriting: any) => {
    try {
        console.error("@writeTableData");

        setIsWriting(true);

        const objectStore = db.transaction(tableName, "readwrite").objectStore(tableName);
        for (let i in data) {
            objectStore.add({ id: `${(i + 1)}`, t: data[i].t, v: data[i].v });
        }

        setIsWriting(false);
    } catch (err) {
        console.error({ function: "writeTableData", err });

        setIsWriting(false);
    }
};

export const readTableData = (db: any, dbRequest: any, tableName: string, setData: any, setIsLoading: any) => {
    try {
        console.error("@readTableData");

        setIsLoading(true);

        const transaction = db.transaction([tableName]);
        const objectStore = transaction.objectStore(tableName);
        const request = objectStore.getAll();

        request.onerror = (event: any) => {
            console.error("error fetching table data");
        };

        request.onsuccess = (event: any) => {
            const dataT = event?.target?.result;
            setData(dataT);
            setIsLoading(false);
        };

    } catch (err) {
        console.error({ function: "readTableData", err, tableName });
        setData([]);
        setIsLoading(false);
    }
};

export const findTableData = (db: any, dbRequest: any, tableName: string, key: string, setData: any, setIsLoading: any) => {
    try {
        console.error("@findTableData");

        setIsLoading(true);

        const transaction = db.transaction([tableName]);

        const objectStore = transaction.objectStore(tableName);

        const request = objectStore.get(key);

        request.onerror = (event: any) => {
            alert("Unable to retrieve data from database!");
        };

        request.onsuccess = (event: any) => {
            if (request.result) {
                setData(request.result);
            } else {
                setData(null);
            }
        };
    } catch (err) {
        console.error({ function: "readTableData", err });

        setIsLoading(false);
    }
};