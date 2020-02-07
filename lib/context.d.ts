/// <reference types="react" />
import { StoreContextValue } from "./types";
export declare const createStoreContext: <S extends any>(initialState: S) => import("react").Context<StoreContextValue<S>>;
