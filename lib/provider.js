"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.createStoreProvider = function (StoreContext) {
    var StoreProvider = function (_a) {
        var children = _a.children, store = _a.store;
        var _b = React.useState(store.getState()), state = _b[0], setState = _b[1];
        var onStateUpdate = function (nextState) {
            setState(nextState);
        };
        React.useEffect(function () {
            var unsubscribe = store.subscribe(onStateUpdate);
            setState(store.getState());
            return function () {
                unsubscribe();
            };
        }, [store]);
        return (React.createElement(StoreContext.Provider, { value: { state: state, store: store } }, children));
    };
    return StoreProvider;
};
//# sourceMappingURL=provider.js.map