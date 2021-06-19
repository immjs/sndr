"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var merge_deep_1 = tslib_1.__importDefault(require("@informath/merge-deep"));
var basic = {
    method: 'POST',
    headers: {
        'Content-Type': 'text/hex',
    },
};
var API = /** @class */ (function () {
    function API(_a) {
        var base = _a.base, basic = _a.basic, prm = _a.prm;
        this.base = base;
        this.basic = basic || {};
        this.prm = prm || {};
        this.senders = {};
    }
    API.prototype.makeSndr = function (sndrName, path, data) {
        var _this = this;
        var change = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            change[_i - 3] = arguments[_i];
        }
        var sender = function () {
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
        };
        sender.Text = function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            return sender.apply(void 0, content).then(function (r) { return r.text(); });
        };
        sender.SCode = function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            return sender.apply(void 0, content).then(function (r) { return r.headers.get('Server_Code'); });
        };
        this.senders[sndrName] = sender;
        return this.senders[sndrName];
    };
    return API;
}());
exports.default = API;
