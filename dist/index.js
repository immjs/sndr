"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var merge_deep_1 = tslib_1.__importDefault(require("merge-deep"));
var API = /** @class */ (function () {
    function API(_a) {
        var base = _a.base, basic = _a.basic, prm = _a.prm, send = _a.send;
        this.base = base;
        this.basic = basic || {};
        this.prm = prm || {};
        this.send = send || {};
    }
    API.prototype.makeSndr = function (_a) {
        var _this = this;
        var sndrName = _a.sndrName, path = _a.path, _b = _a.data, data = _b === void 0 ? {} : _b, _c = _a.change, change = _c === void 0 ? [] : _c, _d = _a.shorthands, shorthands = _d === void 0 ? {} : _d;
        var sender = (function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            var accessRecursive = function (access, obj) {
                if (access.length !== 0) {
                    if (obj[access[0]] == null)
                        obj[access[0]] = {};
                    return accessRecursive(access.splice(1), obj[access[0]]);
                }
                return obj;
            };
            var makeCompliantObject = function (access, to) {
                if (typeof access === 'string')
                    access = access.split(/(?<!\\)\./); // eslint-disable-line no-param-reassign
                var obj = {};
                accessRecursive(access.slice(0, access.length - 1), obj)[access[access.length - 1]] = to;
                return obj;
            };
            var keepContatenating = function (obj) {
                var objs = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    objs[_i - 1] = arguments[_i];
                }
                return (objs.length === 0
                    ? obj
                    : keepContatenating.apply(void 0, tslib_1.__spreadArray([merge_deep_1.default(obj, objs[0])], objs.slice(1))));
            };
            return node_fetch_1.default("http://localhost:3000/" + path, keepContatenating.apply(void 0, tslib_1.__spreadArray([merge_deep_1.default(_this.basic, data)], change.map(function (v, i) { return makeCompliantObject(v, content[i]); }))));
        });
        Object.entries(shorthands || {}).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            sender[key] = value;
        });
        if (sndrName != null)
            this.send[sndrName] = sender;
        return sender;
    };
    return API;
}());
exports.default = API;
