"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
exports.createStoreContext = function () {
    return react_1.createContext({
        get state() {
            throw new Error('StoreContext used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.');
        },
        get store() {
            throw new Error('StoreContext used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.');
        },
    });
};
//# sourceMappingURL=context.js.map