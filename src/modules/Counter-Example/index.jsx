/**
 * EXAMPLE FILE
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./counter.slice";
import DisplayCounter from "./DisplayCounter";

/**
 * @description:
 * Shared component that can be used in both m-site and d-site. Since this component is not specific to any platform we decide to keep it in shared folder.
 */
export default function Counter() {
    const count = useSelector(state => state.counterExample.value);
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                <button aria-label="Increment value" onClick={() => dispatch(increment())}>
                    Increment
                </button>
                <DisplayCounter count={count} />
                <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
                    Decrement
                </button>
            </div>
        </div>
    );
}
