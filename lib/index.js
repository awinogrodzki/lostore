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
var mapReducerCreatorToAction = function (reducerCreator, setState) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var reducer = reducerCreator.apply(void 0, args);
        if (reducer instanceof Promise) {
            return reducer.then(function (reducerFromPromise) {
                setState(function (currentState, rootState) { return reducerFromPromise(currentState, rootState); });
            });
        }
        setState(function (currentState, rootState) { return reducer(currentState, rootState); });
        return undefined;
    };
};
var mapReducersToActions = function (actions, typeOrGroupKey, reducerCreatorOrReducers, setState) {
    var _a, _b;
    if (typeof reducerCreatorOrReducers === 'function') {
        return __assign(__assign({}, actions), (_a = {}, _a[typeOrGroupKey] = mapReducerCreatorToAction(reducerCreatorOrReducers, setState), _a));
    }
    var setChildState = function (key) { return function (callback) {
        setState(function (prevState, rootState) {
            var _a;
            return __assign(__assign({}, prevState), (_a = {}, _a[key] = callback(prevState[key], rootState), _a));
        });
    }; };
    return __assign(__assign({}, actions), (_b = {}, _b[typeOrGroupKey] = Object.entries(reducerCreatorOrReducers).reduce(function (childActions, _a) {
        var key = _a[0], value = _a[1];
        return mapReducersToActions(childActions, key, value, setChildState(typeOrGroupKey));
    }, {}), _b));
};
exports.createStore = function (reducers, initialState, StoreContext, StoreProvider) {
    if (StoreContext === void 0) { StoreContext = context_1.createStoreContext(initialState); }
    if (StoreProvider === void 0) { StoreProvider = provider_1.createStoreProvider(StoreContext, initialState); }
    var useStore = function () {
        var _a = React.useContext(StoreContext), state = _a.state, setState = _a.setState;
        var actions = Object.entries(reducers).reduce(function (aggr, _a) {
            var key = _a[0], value = _a[1];
            return mapReducersToActions(aggr, key, value, function (callback) {
                setState(function (prevState) { return callback(prevState, prevState); });
            });
        }, {});
        return [state, actions];
    };
    var connectStore = function (mapStateToProps, mapActionsToProps) { return function (Component) {
        var MemoizedComponent = React.memo(Component);
        var ComponentContainer = function (props) {
            var _a = useStore(), state = _a[0], actions = _a[1];
            var stateProps = mapStateToProps(state);
            var actionProps = mapActionsToProps(actions);
            return React.createElement(MemoizedComponent, __assign({}, props, stateProps, actionProps));
        };
        return ComponentContainer;
    }; };
    return { StoreProvider: StoreProvider, useStore: useStore, connectStore: connectStore };
};
//# sourceMappingURL=index.js.map