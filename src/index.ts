import fetch, { Response, RequestInit, RequestInfo } from 'node-fetch';
import merge from 'merge-deep';
import { URLSearchParams } from 'url';

interface Sender {
  (...content: string[]): Promise<Response>; // eslint-disable-line no-unused-vars
  [shorthand: string]: () => Promise<any>;
}

interface RequestInitCustom extends RequestInit {
  queryParams? : Record<string, string>
}

interface makeSndrArgs {
  name? : string;
  path : string;
  data : RequestInitCustom;
  shorthands : Record<string, () => Promise<any>>;
}

interface PRM {
  [method: string] : {
    basic? : RequestInitCustom;
    shorthands? : Record<string, () => Promise<any>>;
    change? : string[];
  }
}

class API {
  base: RequestInfo;

  basic: RequestInitCustom;

  send: Record<string, Sender>;

  prm: PRM;

  shorthands: Record<string, () => Promise<any>>;

  constructor({
    base,
    basic,
    shorthands,
    prm,
    send,
  }: {
    base: string,
    basic: Record<string, unknown>,
    shorthands: Record<string, () => Promise<any>>
    prm: PRM,
    send: Record<string, makeSndrArgs>,
  }) {
    this.base = base;
    this.basic = basic || {};
    this.prm = Object.fromEntries(Object.entries(prm || {}).map(([k, v]) => [k.toLowerCase(), v]));
    this.send = Object.fromEntries(Object.entries(send).map(([key, value]) => [key, this.makeSndr(value)])) || {};
    this.shorthands = shorthands;
  }

  makeSndr({
    path,
    data = {},
    shorthands = {},
    name,
  } : makeSndrArgs, ...change : (string[] | string)[]): Sender {
    change = [...(this.prm[(data.method || 'get').toLowerCase()].change || []), ...change]; // eslint-disable-line no-param-reassign
    const sender = ((...content: string[]): Promise<Response> => {
      const accessRecursive = (access: string[], obj: Record<string, any>): Record<string, unknown> => {
        if (access.length !== 0) {
          if (obj[access[0]] == null) obj[access[0]] = {};
          return accessRecursive(access.splice(0, 1), obj[access[0]]);
        }
        return obj;
      };
      const makeCompliantObject = (access: string[] | string, to: any): any => {
        if (typeof access === 'string') access = [access]; // eslint-disable-line no-param-reassign
        const obj = {};
        accessRecursive(access.slice(0, access.length - 1), obj)[access[access.length - 1]] = to;
        return obj;
      };
      const keepContatenating = (
        obj: Record<string, any>,
        ...objs: Record<string, any>[]
      ): Record<string, any> => (objs.length === 0
        ? obj
        : keepContatenating(merge(obj, objs[0]), ...objs.slice(1)));
      data = keepContatenating( // eslint-disable-line no-param-reassign
        merge(this.basic, this.prm[(data.method || 'get').toLowerCase()], data),
        ...change.map((v : string[] | string, i : number) => makeCompliantObject(v, content[i])),
      );
      const queryParams = data.queryParams || {};
      delete data.queryParams;
      return fetch(
        `${this.base}${path}${Object.keys(queryParams).length !== 0 ? `?${new URLSearchParams(queryParams)}` : ''}`,
        data,
      );
    }) as Sender;
    Object.entries({ ...shorthands, ...this.shorthands }).forEach(([key, value] : [string, () => Promise<any>]) => {
      sender[key] = value;
    });
    if (name != null) this.send[name] = sender;
    return sender;
  }
}
export default API;
