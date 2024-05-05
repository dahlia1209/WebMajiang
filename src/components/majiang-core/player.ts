/*
 *  Majiang.Player
 */
"use strict";

import { Shoupai } from './shoupai'
import { He } from './he'
// import { Game,type Msg } from './game'
import { Board,type Kaiju } from './board'
import {tingpai,xiangting,xiangting_guoshi,xiangting_qidui,xiangting_yiban} from './xiangting'
import {hule,hule_mianzi,hule_param} from './hule'
const Majiang = {
    Shoupai: Shoupai,
    He: He,
    Util:  {tingpai,xiangting,xiangting_guoshi,xiangting_qidui,xiangting_yiban,hule,hule_mianzi,hule_param},
    Board: Board
};

export interface Msg {
    kaiju?: Kaiju
    qipai?: any;
    zimo?: any;
    dapai?: any;
    fulou?: any;
    gang?: any;
    gangzimo?: any;
    kaigang?: any;
    hule?: any;
    pingju?: any;
    jieju?: any;
}


export class Player {
    public _model: Board;
    public _callback: any;
    public _view: any; // viewの具体的な型が分からないため、anyを使用
    public _menfeng: any; // 仮に整数型とします
    public _id: any; // IDとして整数型を仮定
    public _rule: any; // ruleの具体的な型が不明
    public _diyizimo: any; // 最初の自摸かどうかのフラグ
    public _n_gang: any; // カンの数
    public _neng_rong: any; // 栄和が可能かどうかのフラグ
    public _paipu: any; // 牌譜の型が不明なためanyを使用
    public action_qipai(qipai:any){}
    public action_kaiju(kaiju:any){}
    public action_zimo(zimo:any,gangzimo:any){}
    public action_dapai(dapai:any):any{}
    public action_fulou(fulou:any){}
    public action_gang(gang:any){}
    public action_hule(hule:any){}
    public action_pingju(pingju:any){}
    public action_jieju(jieju:any){}
    public _node:any;
    public _mianzi:any;
    public sound_on:any;
    public _audio:any;
    public _show_button:boolean=false;
    public _default_reply:any;
    public _timer_id:any;
    
    clear_handler():any {}
    callback(reply:any):any {}
    set_button(type:any, callback:any):any {}
    show_button(callback = ()=>{}):any {}
    clear_button() {}
    select_mianzi(mianzi:any):any {}
    clear_mianzi() {}
    select_dapai(lizhi?:any) {}
    clear_dapai() {}
    set_timer(limit:any, allowed = 0, audio:any) {}
    show_timer() {}
    clear_timer() {}

    constructor() {
        this._model = new Majiang.Board();
    }

    action(msg: Msg, callback?: any) {
        this._callback = callback;

        if (msg.kaiju) this.kaiju(msg.kaiju);
        else if (msg.qipai) this.qipai(msg.qipai);
        else if (msg.zimo) this.zimo(msg.zimo);
        else if (msg.dapai) this.dapai(msg.dapai);
        else if (msg.fulou) this.fulou(msg.fulou);
        else if (msg.gang) this.gang(msg.gang);
        else if (msg.gangzimo) this.zimo(msg.gangzimo, true)
        else if (msg.kaigang) this.kaigang(msg.kaigang);
        else if (msg.hule) this.hule(msg.hule);
        else if (msg.pingju) this.pingju(msg.pingju);
        else if (msg.jieju) this.jieju(msg.jieju);
    }

    get shoupai() { const shoupai:any=this._model.shoupai; return shoupai[this._menfeng] }
    get he() { const he:any=this._model.he; return he[this._menfeng] }
    get shan() { return this._model.shan }
    get hulepai() {
        return Majiang.Util.xiangting(this.shoupai) == 0
            && Majiang.Util.tingpai(this.shoupai)
            || [];
    }
    get model() { return this._model }
    set view(view:any) { this._view = view }

    kaiju(kaiju:Kaiju) {
        this._id = kaiju.id;
        this._rule = kaiju.rule;
        this._model.kaiju(kaiju);
        if (this._view) this._view.kaiju(kaiju.id);

        if (this._callback) this.action_kaiju(kaiju);
    }

    qipai(qipai:any) {
        this._model.qipai(qipai);
        this._menfeng = this._model.menfeng(this._id);
        this._diyizimo = true;
        this._n_gang = 0;
        this._neng_rong = true;
        if (this._view) this._view.redraw();

        if (this._callback) this.action_qipai(qipai);
    }

    zimo(zimo:any, gangzimo?:any) {
        this._model.zimo(zimo);
        if (gangzimo) this._n_gang++;
        if (this._view) {
            if (gangzimo) this._view.update({ gangzimo: zimo });
            else this._view.update({ zimo: zimo });
        }

        if (this._callback) this.action_zimo(zimo, gangzimo);
    }

    dapai(dapai:any) {

        if (dapai.l == this._menfeng) {
            if (!this.shoupai.lizhi) this._neng_rong = true;
        }

        this._model.dapai(dapai);
        if (this._view) this._view.update({ dapai: dapai });

        if (this._callback) this.action_dapai(dapai);

        if (dapai.l == this._menfeng) {
            this._diyizimo = false;
            if (this.hulepai.find(p => this.he.find(p))) this._neng_rong = false;
        }
        else {
            let s = dapai.p[0], n = +dapai.p[1] || 5;
            if (this.hulepai.find(p => p == s + n)) this._neng_rong = false;
        }
    }

    fulou(fulou:any) {
        this._model.fulou(fulou);
        if (this._view) this._view.update({ fulou: fulou });

        if (this._callback) this.action_fulou(fulou);

        this._diyizimo = false;
    }

    gang(gang:any) {
        this._model.gang(gang);
        if (this._view) this._view.update({ gang: gang });

        if (this._callback) this.action_gang(gang);

        this._diyizimo = false;
        if (gang.l != this._menfeng && !gang.m.match(/^[mpsz]\d{4}$/)) {
            let s = gang.m[0], n = +gang.m.slice(-1) || 5;
            if (this.hulepai.find(p => p == s + n)) this._neng_rong = false;
        }
    }

    kaigang(kaigang:any) {
        this._model.kaigang(kaigang);
        if (this._view) this._view.update({ kaigang: kaigang });
    }

    hule(hule:any) {
        this._model.hule(hule);
        if (this._view) this._view.update({ hule: hule });
        if (this._callback) this.action_hule(hule);
    }

    pingju(pingju:any) {
        this._model.pingju(pingju);
        if (this._view) this._view.update({ pingju: pingju });
        if (this._callback) this.action_pingju(pingju);
    }

    jieju(paipu:any) {
        this._model.jieju(paipu);
        this._paipu = paipu;
        if (this._view) this._view.summary(paipu);
        if (this._callback) this.action_jieju(paipu);
    }

    get_dapai(shoupai:any) {
        return Player.get_dapai(this._rule, shoupai);
    }
    get_chi_mianzi(shoupai:any, p:any) {
        if (this.shan)
        return Player.get_chi_mianzi(this._rule, shoupai, p,
            this.shan.paishu);
    }
    get_peng_mianzi(shoupai:any, p:any) {
        if (this.shan)
        return Player.get_peng_mianzi(this._rule, shoupai, p,
            this.shan.paishu);
    }
    get_gang_mianzi(shoupai:any, p:any) {
        if (this.shan)
        return Player.get_gang_mianzi(this._rule, shoupai, p,
            this.shan.paishu, this._n_gang);
    }
    allow_lizhi(shoupai:any, p:any) {
        const defen:any=this._model.defen
        if (this.shan)
        return Player.allow_lizhi(this._rule, shoupai, p,
            this.shan.paishu,
            defen[this._id]);
    }
    allow_hule(shoupai:any, p:any, hupai:any) {
        if (this.shan)
        hupai = hupai || shoupai.lizhi || this.shan.paishu == 0;
        return Player.allow_hule(this._rule, shoupai, p,
            this._model.zhuangfeng, this._menfeng,
            hupai, this._neng_rong);
    }
    allow_pingju(shoupai:any) {
        return Player.allow_pingju(this._rule, shoupai,
            this._diyizimo);
    }
    allow_no_daopai(shoupai:any) {
        if (this.shan)
        return Player.allow_no_daopai(this._rule, shoupai,
            this.shan.paishu);
    }

    static get_dapai(rule: any, shoupai: any) {

        if (rule['喰い替え許可レベル'] == 0) return shoupai.get_dapai(true);
        if (rule['喰い替え許可レベル'] == 1
            && shoupai._zimo && shoupai._zimo.length > 2) {
            let deny = shoupai._zimo[0]
                + (+shoupai._zimo.match(/\d(?=[\+\=\-])/) || 5);
            return shoupai.get_dapai(false)
                .filter((p: any) => p.replace(/0/, '5') != deny);
        }
        return shoupai.get_dapai(false);
    }

    static get_chi_mianzi(rule: any, shoupai: any, p: any, paishu: any) {

        let mianzi = shoupai.get_chi_mianzi(p, rule['喰い替え許可レベル'] == 0);
        if (!mianzi) return mianzi;
        if (rule['喰い替え許可レベル'] == 1
            && shoupai._fulou.length == 3
            && shoupai._bingpai[p[0]][p[1]] == 2) mianzi = [];
        return paishu == 0 ? [] : mianzi;
    }

    static get_peng_mianzi(rule: any, shoupai: any, p: any, paishu: any) {

        let mianzi = shoupai.get_peng_mianzi(p);
        if (!mianzi) return mianzi;
        return paishu == 0 ? [] : mianzi;
    }

    static get_gang_mianzi(rule: any, shoupai: any, p: any, paishu: any, n_gang: any) {

        let mianzi = shoupai.get_gang_mianzi(p);
        if (!mianzi || mianzi.length == 0) return mianzi;

        if (shoupai.lizhi) {
            if (rule['リーチ後暗槓許可レベル'] == 0) return [];
            else if (rule['リーチ後暗槓許可レベル'] == 1) {
                let new_shoupai, n_hule1 = 0, n_hule2 = 0;
                new_shoupai = shoupai.clone().dapai(shoupai._zimo);
                const tingpai: any = Majiang.Util.tingpai(new_shoupai)
                for (let p of tingpai) {
                    n_hule1 += Majiang.Util.hule_mianzi(new_shoupai, p).length;
                }
                new_shoupai = shoupai.clone().gang(mianzi[0]);
                for (let p of tingpai) {
                    n_hule2 += Majiang.Util.hule_mianzi(new_shoupai, p).length;
                }
                if (n_hule1 > n_hule2) return [];
            }
            else {
                let new_shoupai;
                new_shoupai = shoupai.clone().dapai(shoupai._zimo);
                const tingpai: any = Majiang.Util.tingpai(new_shoupai)
                let n_tingpai1 = tingpai.length;
                new_shoupai = shoupai.clone().gang(mianzi[0]);
                if (Majiang.Util.xiangting(new_shoupai) > 0) return [];
                let n_tingpai2 = tingpai.length;
                if (n_tingpai1 > n_tingpai2) return [];
            }
        }
        return paishu == 0 || n_gang == 4 ? [] : mianzi;
    }

    static allow_lizhi(rule: any, shoupai: any, p: any, paishu: any, defen: any) {

        if (!shoupai._zimo) return false;
        if (shoupai.lizhi) return false;
        if (!shoupai.menqian) return false;

        if (!rule['ツモ番なしリーチあり'] && paishu < 4) return false;
        if (rule['トビ終了あり'] && defen < 1000) return false;

        if (Majiang.Util.xiangting(shoupai) > 0) return false;

        if (p) {
            let new_shoupai = shoupai.clone().dapai(p);
            const tingpai: any = Majiang.Util.tingpai(new_shoupai)
            return Majiang.Util.xiangting(new_shoupai) == 0
                && tingpai.length > 0;
        }
        else {
            let dapai = [];
            for (let p of Player.get_dapai(rule, shoupai)) {
                let new_shoupai = shoupai.clone().dapai(p);
                const tingpai: any = Majiang.Util.tingpai(new_shoupai)
                if (Majiang.Util.xiangting(new_shoupai) == 0
                    && tingpai.length > 0) {
                    dapai.push(p);
                }
            }
            return dapai.length ? dapai : false;
        }
    }

    static allow_hule(rule: any, shoupai: any, p: any, zhuangfeng: any, menfeng: any, hupai: any, neng_rong: any) {

        if (p && !neng_rong) return false;

        let new_shoupai = shoupai.clone();
        if (p) new_shoupai.zimo(p);
        if (Majiang.Util.xiangting(new_shoupai) != -1) return false;

        if (hupai) return true;

        let param = {
            rule: rule,
            zhuangfeng: zhuangfeng,
            menfeng: menfeng,
            hupai: {},
            baopai: [],
            jicun: { changbang: 0, lizhibang: 0 }
        };
        let hule: any = Majiang.Util.hule(shoupai, p, param);

        return hule.hupai != null;
    }

    static allow_pingju(rule: any, shoupai: any, diyizimo: any) {

        if (!(diyizimo && shoupai._zimo)) return false;
        if (!rule['途中流局あり']) return false;

        let n_yaojiu = 0;
        for (let s of ['m', 'p', 's', 'z']) {
            let bingpai = shoupai._bingpai[s];
            let nn = (s == 'z') ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];
            for (let n of nn) {
                if (bingpai[n] > 0) n_yaojiu++;
            }
        }
        return n_yaojiu >= 9;
    }

    static allow_no_daopai(rule: any, shoupai: any, paishu: any) {

        if (paishu > 0 || shoupai._zimo) return false;
        if (!rule['ノーテン宣言あり']) return false;
        if (shoupai.lizhi) return false;
        const tingpai: any = Majiang.Util.tingpai(shoupai)
        return Majiang.Util.xiangting(shoupai) == 0
            && tingpai.length > 0;
    }
}
