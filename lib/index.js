"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var context_1 = require("./context");
var provider_1 = require("./provider");
exports.createStoreHook = function (reducers, initialState, StoreContext, StoreProvider) {
    if (StoreContext === void 0) { StoreContext = context_1.createStoreContext(initialState); }
    if (StoreProvider === void 0) { StoreProvider = provider_1.createStoreProvider(StoreContext, initialState); }
    var useStore = function () {
        var _a = React.useContext(StoreContext), state = _a.state, setState = _a.setState;
        var actions = Object.entries(reducers).reduce(function (actions, _a) {
            var _b;
            var actionType = _a[0], reducerCreator = _a[1];
            return (__assign(__assign({}, actions), (_b = {}, _b[actionType] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var reducer = reducerCreator.apply(void 0, args);
                if (reducer instanceof Promise) {
                    return reducer.then(function (reducerFromPromise) {
                        setState(function (currentState) { return reducerFromPromise(currentState); });
                    });
                }
                setState(function (currentState) { return reducer(currentState); });
            }, _b)));
        }, {});
        return [state, actions];
    };
    return [StoreProvider, useStore];
};
//# sourceMappingURL=index.js.map