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
var store_1 = require("./store");
var mapReducerCreatorToAction = function (reducerCreator, store) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var reducer = reducerCreator.apply(void 0, args);
        if (reducer instanceof Promise) {
            return reducer.then(function (reducerFromPromise) {
                store.setState(reducerFromPromise(store.getState()));
            });
        }
        store.setState(reducer(store.getState()));
        return undefined;
    };
};
var mapReducersToActions = function (actions, typeOrGroupKey, reducerCreator, store) {
    var _a;
    return __assign(__assign({}, actions), (_a = {}, _a[typeOrGroupKey] = mapReducerCreatorToAction(reducerCreator, store), _a));
};
exports.createHookStore = function (reducers, initialState) {
    var StoreContext = context_1.createStoreContext();
    var StoreProvider = provider_1.createStoreProvider(StoreContext);
    var useStore = function () {
        var _a = React.useContext(StoreContext), state = _a.state, store = _a.store;
        var actions = Object.entries(reducers).reduce(function (aggr, _a) {
            var key = _a[0], value = _a[1];
            return mapReducersToActions(aggr, key, value, store);
        }, {});
        return [state, actions];
    };
    var connectStore = function (mapStateToProps, mapActionsToProps, propsAreEqual) { return function (Component) {
        var MemoizedComponent = React.memo(Component, propsAreEqual);
        return function (props) {
            var _a = useStore(), state = _a[0], actions = _a[1];
            var stateProps = mapStateToProps(state, props);
            var actionProps = mapActionsToProps(actions, props);
            return React.createElement(MemoizedComponent, __assign({}, props, stateProps, actionProps));
        };
    }; };
    return {
        StoreContext: StoreContext,
        StoreProvider: StoreProvider,
        useStore: useStore,
        connectStore: connectStore,
        createStore: function (prerenderedState) {
            if (prerenderedState === void 0) { prerenderedState = initialState; }
            return store_1.createStore(prerenderedState);
        },
    };
};
//# sourceMappingURL=index.js.map