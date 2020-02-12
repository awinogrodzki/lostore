"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var utils_1 = require("./utils");
exports.isStateEqual = function (prevState, nextState) {
    if (prevState === nextState) {
        return true;
    }
    if (utils_1.isObjectLiteral(prevState) && utils_1.isObjectLiteral(nextState)) {
        var prevStatePropertiesMatch = Object.entries(prevState).every(function (_a) {
            var key = _a[0], value = _a[1];
            return nextState[key] === value;
        });
        var hasTheSameLength = Object.keys(prevState).length === Object.keys(nextState).length;
        return prevStatePropertiesMatch && hasTheSameLength;
    }
    if (Array.isArray(prevState) && Array.isArray(nextState)) {
        var prevStateValuesMatch = prevState.every(function (value, index) { return value === nextState[index]; });
        var hasTheSameLength = prevState.length === nextState.length;
        return prevStateValuesMatch && hasTheSameLength;
    }
    return false;
};
exports.createStoreProvider = function (StoreContext, initialState) {
    var StoreProvider = function (_a) {
        var children = _a.children, initialStateFromProps = _a.initialState;
        var _b = React.useState((initialStateFromProps !== null && initialStateFromProps !== void 0 ? initialStateFromProps : initialState)), state = _b[0], setState = _b[1];
        var MemoizedStoreProvider = React.memo(function (_a) {
            var state = _a.state, setState = _a.setState;
            return (React.createElement(StoreContext.Provider, { value: { state: state, setState: setState } }, children));
        }, function (prevProps, nextProps) { return exports.isStateEqual(prevProps.state, nextProps.state); });
        return React.createElement(MemoizedStoreProvider, { state: state, setState: setState });
    };
    return StoreProvider;
};
//# sourceMappingURL=provider.js.map