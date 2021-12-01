import React, { useEffect, useState, useRef, useCallback } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useClickAwayListener(callback, ref) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export function useAsyncState(initialState) {
    const [state, setState] = useState(initialState);
    const resolveState = useRef();
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (resolveState.current) {
            resolveState.current(state);
        }
    }, [state]);

    const setAsyncState = useCallback(
        newState =>
            new Promise(resolve => {
                if (isMounted.current) {
                    resolveState.current = resolve;
                    setState(newState);
                }
            }),
        []
    );

    return [state, setAsyncState];
}
