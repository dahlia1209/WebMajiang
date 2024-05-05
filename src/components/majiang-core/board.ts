/*
 *  Majiang.Board
 */
"use strict";

import { Shoupai } from './shoupai'
import { He } from './he'
import { type RuleConfig } from './rule'

const Majiang = {
    Shoupai: Shoupai,
    He: He
};



class Shan {
    public paishu: number;
    public baopai: string[];
    public fubaopai?: string[];

    constructor(baopai: string) {
        this.paishu = 136 - 13 * 4 - 14;  // 牌の初期枚数を計算
        this.baopai = [baopai];          // 初期の宝牌をセット
        this.fubaopai = [];              // 追加の宝牌用配列、未使用時は空配列とするかundefinedを初期値とする
    }

    zimo(p?: string): string {
        this.paishu--;                   // 牌数を減らす
        return p || '_';                 // 指定された牌がなければ'_'を返す
    }

    kaigang(baopai: string): void {
        this.baopai.push(baopai);        // 新しい宝牌を追加
    }
}

export interface Kaiju {
    id?: string;
    rule?: RuleConfig;
    title: string;
    player: string[];
    qijia: number;
    zhuangfeng: number;
    jushu: number;
    changbang: number;
    lizhibang: number;
    defen: number[];
    shan: any;
    shoupai: any[];
    he: any[];
    player_id: number[];
    lunban?: any
}


export class Board {
    public title: string | undefined;
    public player: string[] | undefined;
    public qijia: number | undefined;
    public zhuangfeng: number | undefined;
    public jushu: number | undefined;
    public changbang: number | undefined;
    public lizhibang: number | undefined;
    public defen: number[] | undefined;
    public shan: Shan | undefined;  
    public shoupai: any[] | undefined;  
    public he: any[] | undefined;  
    public player_id: number[] | undefined;
    public lunban: number | undefined;
    public _lizhi: any;
    public _fenpei: any;

    set_audio(audio:any) {}
    redraw() {}
    update(data:any = {}) {}
    say(name : 'chi'|'peng'|'gang'|'lizhi'|'rong'|'zimo', l:any) {}
    summary(paipu:any) {}
    players(players:any) {}

    constructor(kaiju?: Kaiju) {
        if (kaiju) this.kaiju(kaiju);
    }

    kaiju(kaiju: Kaiju): void {
        this.title = kaiju.title;
        this.player = kaiju.player;
        this.qijia = kaiju.qijia;

        this.zhuangfeng = kaiju.zhuangfeng ?? 0;
        this.jushu = kaiju.jushu ?? 0;
        this.changbang = kaiju.changbang ?? 0;
        this.lizhibang = kaiju.lizhibang ?? 0;
        this.defen = kaiju.defen ?? [];
        this.shan = kaiju.shan ?? null;
        this.shoupai = kaiju.shoupai ?? [];
        this.he = kaiju.he ?? [];
        this.player_id = kaiju.player_id ?? [0, 1, 2, 3];
        this.lunban = kaiju.zhuangfeng ?? -1;

        this._lizhi = undefined;
        this._fenpei = undefined;
    }

    menfeng(id: number) {
        if (this.qijia == undefined || this.jushu == undefined) throw new Error(`this.qijia:${this.qijia} or this.jushu:${this.jushu} is undefined`)
        return (id + 4 - this.qijia + 4 - this.jushu) % 4;
    }

    qipai(qipai: any) {
        this.zhuangfeng = qipai.zhuangfeng;
        this.jushu = qipai.jushu;
        this.changbang = qipai.changbang;
        this.lizhibang = qipai.lizhibang;
        this.shan = new Shan(qipai.baopai);
        for (let l = 0; l < 4; l++) {
            let paistr = qipai.shoupai[l] || '_'.repeat(13);
            this.shoupai![l] = Majiang.Shoupai.fromString(paistr);
            this.he![l] = new Majiang.He();
            this.player_id![l] = (this.qijia! + this.jushu! + l) % 4;
            this.defen![this.player_id![l]] = qipai.defen[l];
        }
        this.lunban = -1;

        this._lizhi = false;
        this._fenpei = null;
    }

    lizhi() {
        if (this._lizhi) {
            this.defen![this.player_id![this.lunban!]] -= 1000;
            this.lizhibang!++;
            this._lizhi = false;
        }
    }

    zimo(zimo: any) {
        this.lizhi();
        this.lunban = zimo.l;
        if(this.shan) this.shoupai![zimo.l].zimo(this.shan.zimo(zimo.p), false);
    }

    dapai(dapai: any) {
        this.lunban = dapai.l;
        this.shoupai![dapai.l].dapai(dapai.p, false);
        this.he![dapai.l].dapai(dapai.p);
        this._lizhi = dapai.p.slice(-1) == '*';
    }

    fulou(fulou: any) {
        this.lizhi();
        this.he![this.lunban!].fulou(fulou.m);
        this.lunban = fulou.l;
        this.shoupai![fulou.l].fulou(fulou.m, false);
    }

    gang(gang: any) {
        this.lunban = gang.l;
        this.shoupai![gang.l].gang(gang.m, false);
    }

    kaigang(kaigang: any) {
        if(this.shan) this.shan.kaigang(kaigang.baopai);
    }

    hule(hule: any) {
        let shoupai = this.shoupai![hule.l];
        shoupai.fromString(hule.shoupai);
        if (hule.baojia != null) shoupai.dapai(shoupai.get_dapai().pop());
        if (this._fenpei) {
            this.changbang = 0;
            this.lizhibang = 0;
            for (let l = 0; l < 4; l++) {
                this.defen![this.player_id![l]] += this._fenpei[l];
            }
        }
        if(this.shan)  this.shan.fubaopai = hule.fubaopai;
        this._fenpei = hule.fenpei;
    }

    pingju(pingju: any) {
        if (!pingju.name.match(/^三家和/)) this.lizhi();
        for (let l = 0; l < 4; l++) {
            if (pingju.shoupai[l])
                this.shoupai![l].fromString(pingju.shoupai[l]);
        }
    }

    jieju(paipu: any) {
        for (let id = 0; id < 4; id++) {
            this.defen![id] = paipu.defen[id];
        }
        this.lunban = -1;
    }
}