"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.createStoreProvider = function (StoreContext, initialState) {
    var StoreProvider = function (_a) {
        var children = _a.children, initialStateFromProps = _a.initialState;
        var _b = React.useState((initialStateFromProps !== null && initialStateFromProps !== void 0 ? initialStateFromProps : initialState)), state = _b[0], setState = _b[1];
        return React.createElement(StoreContext.Provider, { value: { state: state, setState: setState } }, children);
    };
    return StoreProvider;
};
//# sourceMappingURL=provider.js.map