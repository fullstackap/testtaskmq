import { useCallback, useEffect, useRef, useState } from "react";

const useStateWithCallback = (initialValue: any) => {
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

export default useStateWithCallback;