import fetch, { Response, RequestInit, RequestInfo } from 'node-fetch';
import merge from 'merge-deep';

interface Sender {
  (...content: string[]): Promise<Response>; // eslint-disable-line no-unused-vars
  [shorthand: string]: () => Promise<any>;
}

interface API {
  base: RequestInfo;
  basic: RequestInit;
  send: Record<string, Sender>;
  prm: Record<string, RequestInit>;
  shorthands: Record<string, () => Promise<any>>;
}

interface APIArgs extends API {}

interface makeSndrArgs {
  sndrName? : string;
  path : string;
  data : Record<string, unknown>;
  change : string[];
  shorthands : Record<string, () => Promise<any>>;
}

class API {
  constructor ({ base, basic, prm, send }: APIArgs) {
    this.base = base;
    this.basic = basic || {};
    this.prm = prm || {};
    this.send = send || {};
  }
  makeSndr({
    sndrName,
    path,
    data = {},
    change = [],
    shorthands = {},
  } : makeSndrArgs): Sender {
    const sender = ((...content: string[]): Promise<Response> => {
      const accessRecursive = (access: string[], obj: Record<string, any>): Record<string, unknown> => {
        if (access.length !== 0) {
          if (obj[access[0]] == null) obj[access[0]] = {};
          return accessRecursive(access.splice(1), obj[access[0]]);
        }
        return obj;
      };
      const makeCompliantObject = (access: string[] | string, to: any): any => {
        if (typeof access === 'string') access = access.split(/(?<!\\)\./); // eslint-disable-line no-param-reassign
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
      return fetch(
        `http://localhost:3000/${path}`,
        keepContatenating(
          merge(this.basic, data),
          ...change.map((v, i) => makeCompliantObject(v, content[i])),
        ),
      );
    }) as Sender;
    Object.entries(shorthands || {}).forEach(([key, value] : [string, () => Promise<any>]) => {
      sender[key] = value;
    });
    if (sndrName != null) this.send[sndrName] = sender;
    return sender;
  }
}
export default API;
