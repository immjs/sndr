"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var merge_deep_1 = tslib_1.__importDefault(require("merge-deep"));
var url_1 = require("url");
var API = /** @class */ (function () {
    function API(_a) {
        var _this = this;
        var base = _a.base, basic = _a.basic, shorthands = _a.shorthands, prm = _a.prm, send = _a.send;
        this.base = base;
        this.basic = basic || {};
        this.prm = Object.fromEntries(Object.entries(prm || {}).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k.toLowerCase(), v];
        }));
        this.send = Object.fromEntries(Object.entries(send).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, _this.makeSndr(value)];
        })) || {};
        this.shorthands = shorthands;
    }
    API.prototype.makeSndr = function (_a) {
        var _this = this;
        var path = _a.path, _b = _a.data, data = _b === void 0 ? {} : _b, _c = _a.shorthands, shorthands = _c === void 0 ? {} : _c, name = _a.name;
        var change = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            change[_i - 1] = arguments[_i];
        }
        change = tslib_1.__spreadArray(tslib_1.__spreadArray([], (this.prm[(data.method || 'get').toLowerCase()].change || [])), change); // eslint-disable-line no-param-reassign
        var sender = (function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            var accessRecursive = function (access, obj) {
                if (access.length !== 0) {
                    if (obj[access[0]] == null)
                        obj[access[0]] = {};
                    return accessRecursive(access.splice(0, 1), obj[access[0]]);
                }
                return obj;
            };
            var makeCompliantObject = function (access, to) {
                if (typeof access === 'string')
                    access = [access]; // eslint-disable-line no-param-reassign
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
            data = keepContatenating.apply(void 0, tslib_1.__spreadArray([// eslint-disable-line no-param-reassign
                merge_deep_1.default(_this.basic, _this.prm[(data.method || 'get').toLowerCase()], data)], change.map(function (v, i) { return makeCompliantObject(v, content[i]); })));
            var queryParams = data.queryParams || {};
            delete data.queryParams;
            return node_fetch_1.default("" + _this.base + path + (Object.keys(queryParams).length !== 0 ? "?" + new url_1.URLSearchParams(queryParams) : ''), data);
        });
        Object.entries(tslib_1.__assign(tslib_1.__assign({}, shorthands), this.shorthands)).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            sender[key] = value;
        });
        if (name != null)
            this.send[name] = sender;
        return sender;
    };
    return API;
}());
exports.default = API;
