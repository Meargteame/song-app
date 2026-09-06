import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import songReducer from "./slices/songSlice";
import rootSaga from "./sagas/songSaga";

// 1. Create the Saga courier engine
const sagaMiddleware = createSagaMiddleware();

// 2. Build the main store (our central notebook)
export const store = configureStore({
  reducer: {
    songs: songReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 3. Start the courier listening for tasks in the background
sagaMiddleware.run(rootSaga);

// 4. Export TypeScript types for reading and dispatching
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;