"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Store = /** @class */ (function () {
    function Store(initialState) {
        this.subscribers = new Set();
        this.state = initialState;
    }
    Store.prototype.setState = function (state) {
        this.state = state;
        this.publish();
    };
    Store.prototype.getState = function () {
        return this.state;
    };
    Store.prototype.subscribe = function (listener) {
        var _this = this;
        this.subscribers.add(listener);
        return function () { return _this.subscribers.delete(listener); };
    };
    Store.prototype.publish = function () {
        var _this = this;
        this.subscribers.forEach(function (subscriber) {
            subscriber(_this.state);
        });
    };
    return Store;
}());
exports.Store = Store;
exports.createStore = function (initialState) {
    return new Store(initialState);
};
//# sourceMappingURL=store.js.map