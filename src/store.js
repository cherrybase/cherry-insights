import { configureStore } from "@reduxjs/toolkit";

import CounterReducer from "./modules/Counter-Example/counter.slice";

export const store = configureStore({
    reducer: {
        counterExample: CounterReducer
    }
});
/**
 * creates a Redux store, and also automatically configures the Redux DevTools extension so that you can inspect the store while developing.
*/
