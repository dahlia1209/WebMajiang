/*
 *  Majiang.He
 */
"use strict";

import  * as Majiang from './shoupai'

export class He {
    private _pai: string[];
    private _find: {[key: string]: boolean};

    constructor() {
        this._pai  = [];
        this._find = {};
    }

    dapai(p: string) {
        if (! Majiang.Shoupai.valid_pai(p))         throw new Error(p);
        this._pai.push(p.replace(/[\+\=\-]$/,''));
        this._find[p[0]+(+p[1]||5)] = true;
        return this;
    }

    fulou(m: string) {
        if (! Majiang.Shoupai.valid_mianzi(m))      throw new Error(m);
        let p = m[0] + m.match(/\d(?=[\+\=\-])/), d = m.match(/[\+\=\-]/);
        if (! d)                                    throw new Error(m);
        if (this._pai[this._pai.length - 1].slice(0,2) != p)
                                                    throw new Error(m);
        this._pai[this._pai.length - 1] += d;
        return this;
    }

    find(p: string) {
        return this._find[p[0]+(+p[1]||5)];
    }
}