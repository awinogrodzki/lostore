"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectLiteral = function (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
};
exports.isStateEqual = function (prevState, nextState) {
    if (prevState === nextState) {
        return true;
    }
    if (exports.isObjectLiteral(prevState) && exports.isObjectLiteral(nextState)) {
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
//# sourceMappingURL=utils.js.map