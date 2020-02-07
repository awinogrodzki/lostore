"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
exports.createStoreContext = function (initialState) {
    return react_1.createContext({
        state: initialState,
        setState: function () {
            throw new Error('useStore hook used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.');
        },
    });
};
//# sourceMappingURL=context.js.map