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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.createStoreHook = function (reducers, initialState) {
    var StoreContext = React.createContext({
        state: initialState,
        setState: function () {
            throw new Error('useStore hook used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.');
        },
    });
    var StoreProvider = function (_a) {
        var children = _a.children;
        var _b = React.useState(initialState), state = _b[0], setState = _b[1];
        return React.createElement(StoreContext.Provider, { value: { state: state, setState: setState } }, children);
    };
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
                return __awaiter(void 0, void 0, void 0, function () {
                    var reducer, result, reducerFromPromise, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                reducer = reducerCreator.apply(void 0, args);
                                if (!(reducer instanceof Promise)) return [3 /*break*/, 2];
                                return [4 /*yield*/, reducer];
                            case 1:
                                reducerFromPromise = _b.sent();
                                result = reducerFromPromise(state);
                                return [3 /*break*/, 3];
                            case 2:
                                result = reducer(state);
                                _b.label = 3;
                            case 3:
                                if (!(result instanceof Promise)) return [3 /*break*/, 5];
                                _a = setState;
                                return [4 /*yield*/, result];
                            case 4:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/];
                            case 5:
                                setState(result);
                                return [2 /*return*/];
                        }
                    });
                });
            }, _b)));
        }, {});
        return [state, actions];
    };
    return [StoreProvider, useStore];
};
//# sourceMappingURL=index.js.map