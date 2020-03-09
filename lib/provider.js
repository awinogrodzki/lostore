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
exports.createStoreProvider = function (StoreContext) {
    var MemoizedStoreProvider = React.memo(function (_a) {
        var state = _a.state, store = _a.store, children = _a.children;
        return React.createElement(StoreContext.Provider, { value: { state: state, store: store } }, children);
    }, function (prevProps, nextProps) {
        return exports.isStateEqual(prevProps.state, nextProps.state) && nextProps.store === prevProps.store;
    });
    var StoreProvider = function (_a) {
        var children = _a.children, store = _a.store;
        var _b = React.useState(store.getState()), state = _b[0], setState = _b[1];
        var onStateUpdate = function (state) { return setState(state); };
        React.useEffect(function () {
            var unsubscribe = store.subscribe(onStateUpdate);
            return function () {
                unsubscribe();
            };
        }, [store]);
        return (React.createElement(MemoizedStoreProvider, { state: state, store: store }, children));
    };
    return StoreProvider;
};
//# sourceMappingURL=provider.js.map