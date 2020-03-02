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
var isCallback = function (callback) { return typeof callback === 'function'; };
exports.createStoreProvider = function (StoreContext, initialState) {
    var MemoizedStoreProvider = React.memo(function (_a) {
        var state = _a.state, setState = _a.setState, children = _a.children;
        return React.createElement(StoreContext.Provider, { value: { state: state, setState: setState } }, children);
    }, function (prevProps, nextProps) { return exports.isStateEqual(prevProps.state, nextProps.state); });
    var StoreProvider = function (_a) {
        var children = _a.children, prerenderedState = _a.prerenderedState, onUpdate = _a.onUpdate;
        var _b = React.useState((prerenderedState !== null && prerenderedState !== void 0 ? prerenderedState : initialState)), state = _b[0], setState = _b[1];
        var handleUpdate = function (state) {
            if (typeof onUpdate !== 'function') {
                return;
            }
            onUpdate(state);
        };
        var handleSetState = function (callback) {
            setState(function (prevState) {
                if (isCallback(callback)) {
                    var newState = callback(prevState);
                    handleUpdate(newState);
                    return newState;
                }
                handleUpdate(callback);
                return callback;
            });
        };
        return (React.createElement(MemoizedStoreProvider, { state: state, setState: handleSetState }, children));
    };
    return StoreProvider;
};
//# sourceMappingURL=provider.js.map