/*
 *  Majiang.Game
 */
"use strict";

import { type RuleConfig, getRules } from './rule'
import { Shoupai } from './shoupai'
import { Shan } from './shan'
import { He } from './he'
import { Board, type Kaiju } from './board'
import { tingpai, xiangting, xiangting_guoshi, xiangting_qidui, xiangting_yiban } from './xiangting'
import { hule, hule_mianzi, hule_param } from './hule'
// import type { Board as  UiBoard} from '../majiang-ui';
import { Player, type Msg } from './player';
const Majiang = {
    rule: getRules,
    Shoupai: Shoupai,
    Shan: Shan,
    He: He,
    Util: { tingpai, xiangting, xiangting_guoshi, xiangting_qidui, xiangting_yiban, hule, hule_mianzi, hule_param }
};

// interface Model {
//     title: string;
//     player: string[];
//     qijia: number;
//     zhuangfeng: number;
//     jushu: number;
//     changbang: number;
//     lizhibang: number;
//     defen: number[];
//     shan: any;
//     shoupai: any[];
//     he: any[];
//     player_id: number[];
//     lunban?: any
// }

export class Game {
    public _callback: any;
    public _handler: any;
    public _model: Board;
    public _players: Player[];
    public _reply: any;
    public _rule: any;
    public _speed: number;
    public _status: any;
    public _stop: any;
    public _sync: any;
    public _timeout_id: any;
    public _view?: Board;
    public _wait: any;
    public _paipu: any;
    public _max_jushu: any;
    public _changbang: any;
    public _dapai: any;
    public _diyizimo: any;
    public _fengpai: any;
    public _fenpei: any;
    public _gang: any;
    public _hule: any;
    public _hule_option: any;
    public _lianzhuang: any;
    public _lizhi: any;
    public _n_gang: any;
    public _neng_rong: any;
    public _no_game: any;
    public _yifa: any;


    constructor(players: Player[], callback: any, rule: RuleConfig, title?: string) {

        this._players = players;
        this._callback = callback || (() => { });
        this._rule = rule || Majiang.rule();

        // this._model = {
        //     title: title || '電脳麻将\n' + new Date().toLocaleString(),
        //     player: ['私', '下家', '対面', '上家'],
        //     qijia: 0,
        //     zhuangfeng: 0,
        //     jushu: 0,
        //     changbang: 0,
        //     lizhibang: 0,
        //     defen: [0, 0, 0, 0].map(x => this._rule['配給原点']),
        //     shan: null,
        //     shoupai: [],
        //     he: [],
        //     player_id: [0, 1, 2, 3]
        // };
        this._model = new Board()
        const kaiju: Kaiju = {
            title: title || '電脳麻将\n' + new Date().toLocaleString(),
            player: ['私', '下家', '対面', '上家'],
            qijia: 0,
            zhuangfeng: 0,
            jushu: 0,
            changbang: 0,
            lizhibang: 0,
            defen: [0, 0, 0, 0].map(x => this._rule['配給原点']),
            shan: null,
            shoupai: [],
            he: [],
            player_id: [0, 1, 2, 3]
        }
        this._model.kaiju(kaiju)

        this._view;

        this._status;
        this._reply = [];

        this._sync = false;
        this._stop = null;
        this._speed = 3;
        this._wait = 0;
        this._timeout_id;

        this._handler;
    }

    get model() { return this._model }
    set view(view: Board) { this._view = view }
    get speed() { return this._speed }
    set speed(speed) { this._speed = speed }
    set wait(wait: any) { this._wait = wait }

    set handler(callback: any) { this._handler = callback }

    add_paipu(paipu: any) {
        this._paipu.log[this._paipu.log.length - 1].push(paipu);
    }

    delay(callback: any, timeout: any) {

        if (this._sync) return callback();

        timeout = this._speed == 0 ? 0
            : timeout == null ? Math.max(500, this._speed * 200)
                : timeout;
        setTimeout(callback, timeout);
    }

    say(name: any, l: any) {
        if (this._view) this._view.say(name, l);
    }

    stop(callback = () => { }) {
        this._stop = callback;
    }

    start() {
        if (this._timeout_id) return;
        this._stop = null;
        this._timeout_id = setTimeout(() => this.next(), 0);
    }

    notify_players(type: any, msg: Msg[]) {

        for (let l = 0; l < 4; l++) {
            let id = this._model.player_id[l];
            if (this._sync)
                this._players[id].action(msg[l]);
            else setTimeout(() => {
                this._players[id].action(msg[l]);
            }, 0);
        }
    }

    call_players(type: any, msg: Msg[], timeout: any) {
        timeout = this._speed == 0 ? 0
            : timeout == null ? this._speed * 200
                : timeout;
        this._status = type;
        this._reply = [];
        for (let l = 0; l < 4; l++) {
            let id = this._model.player_id[l];
            if (this._sync)
                this._players[id].action(
                    msg[l], (reply: any) => this.reply(id, reply));
            else setTimeout(() => {
                this._players[id].action(
                    msg[l], (reply: any) => this.reply(id, reply));
            }, 0);
        }
        if (!this._sync)
            this._timeout_id = setTimeout(() => this.next(), timeout);
    }

    reply(id: any, reply: any) {
        this._reply[id] = reply || {};
        if (this._sync) return;
        if (this._reply.filter((x: any) => x).length < 4) return;
        if (!this._timeout_id)
            this._timeout_id = setTimeout(() => this.next(), 0);
    }

    next() {
        this._timeout_id = clearTimeout(this._timeout_id);
        if (this._reply.filter((x: any) => x).length < 4) return;
        if (this._stop) return this._stop();

        if (this._status == 'kaiju') this.reply_kaiju();
        else if (this._status == 'qipai') this.reply_qipai();
        else if (this._status == 'zimo') this.reply_zimo();
        else if (this._status == 'dapai') this.reply_dapai();
        else if (this._status == 'fulou') this.reply_fulou();
        else if (this._status == 'gang') this.reply_gang();
        else if (this._status == 'gangzimo') this.reply_zimo();
        else if (this._status == 'hule') this.reply_hule();
        else if (this._status == 'pingju') this.reply_pingju();
        else this._callback(this._paipu);
    }

    do_sync() {

        this._sync = true;

        this.kaiju();

        for (; ;) {
            if (this._status == 'kaiju') this.reply_kaiju();
            else if (this._status == 'qipai') this.reply_qipai();
            else if (this._status == 'zimo') this.reply_zimo();
            else if (this._status == 'dapai') this.reply_dapai();
            else if (this._status == 'fulou') this.reply_fulou();
            else if (this._status == 'gang') this.reply_gang();
            else if (this._status == 'gangzimo') this.reply_zimo();
            else if (this._status == 'hule') this.reply_hule();
            else if (this._status == 'pingju') this.reply_pingju();
            else break;
        }

        this._callback(this._paipu);

        return this;
    }

    kaiju(qijia?: number) {
        this._model.qijia = qijia ?? Math.floor(Math.random() * 4);

        this._max_jushu = this._rule['場数'] == 0 ? 0 : this._rule['場数'] * 4 - 1;

        this._paipu = {
            title: this._model.title,
            player: this._model.player,
            qijia: this._model.qijia,
            log: [],
            defen: this._model.defen.concat(),
            point: [],
            rank: []
        };

        let msg: Msg[] = [];
        for (let id = 0; id < 4; id++) {
            msg[id] = JSON.parse(JSON.stringify({
                kaiju: {
                    id: id,
                    rule: this._rule,
                    title: this._paipu.title,
                    player: this._paipu.player,
                    qijia: this._paipu.qijia
                }
            }));
        }
        this.call_players('kaiju', msg, 0);

        if (this._view) this._view.kaiju();
    }

    qipai(shan: any) {

        let model = this._model;

        model.shan = shan || new Majiang.Shan(this._rule);
        for (let l = 0; l < 4; l++) {
            let qipai = [];
            for (let i = 0; i < 13; i++) {
                qipai.push(model.shan.zimo());
            }
            model.shoupai[l] = new Majiang.Shoupai(qipai);
            model.he[l] = new Majiang.He();
            model.player_id[l] = (model.qijia + model.jushu + l) % 4;
        }
        model.lunban = -1;

        this._diyizimo = true;
        this._fengpai = this._rule['途中流局あり'];

        this._dapai = null;
        this._gang = null;

        this._lizhi = [0, 0, 0, 0];
        this._yifa = [0, 0, 0, 0];
        this._n_gang = [0, 0, 0, 0];
        this._neng_rong = [1, 1, 1, 1];

        this._hule = [];
        this._hule_option = null;
        this._no_game = false;
        this._lianzhuang = false;
        this._changbang = model.changbang;
        this._fenpei = null;

        this._paipu.defen = model.defen.concat();
        this._paipu.log.push([]);
        let paipu = {
            qipai: {
                zhuangfeng: model.zhuangfeng,
                jushu: model.jushu,
                changbang: model.changbang,
                lizhibang: model.lizhibang,
                defen: model.player_id.map((id: any) => model.defen[id]),
                baopai: model.shan.baopai[0],
                shoupai: model.shoupai.map((shoupai: any) => shoupai.toString())
            }
        };
        this.add_paipu(paipu);

        let msg: Msg[] = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
            for (let i = 0; i < 4; i++) {
                if (i != l) msg[l].qipai.shoupai[i] = '';
            }
        }
        this.call_players('qipai', msg, 0);

        if (this._view) this._view.redraw();
    }

    zimo() {
        let model = this._model;

        model.lunban = (model.lunban + 1) % 4;
        
        let zimo = model.shan.zimo();
        model.shoupai[model.lunban].zimo(zimo);

        let paipu = { zimo: { l: model.lunban, p: zimo } };
        this.add_paipu(paipu);

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
            if (l != model.lunban) msg[l].zimo.p = '';
        }
        this.call_players('zimo', msg, null);

        if (this._view) this._view.update(paipu);
    }

    dapai(dapai: any) {
        let model = this._model;

        this._yifa[model.lunban] = 0;

        if (!model.shoupai[model.lunban].lizhi)
            this._neng_rong[model.lunban] = true;

        model.shoupai[model.lunban].dapai(dapai);
        model.he[model.lunban].dapai(dapai);

        if (this._diyizimo) {
            if (!dapai.match(/^z[1234]/)) this._fengpai = false;
            if (this._dapai && this._dapai.slice(0, 2) != dapai.slice(0, 2))
                this._fengpai = false;
        }
        else this._fengpai = false;

        if (dapai.slice(-1) == '*') {
            this._lizhi[model.lunban] = this._diyizimo ? 2 : 1;
            this._yifa[model.lunban] = this._rule['一発あり'];
        }

        const shoupai = model.shoupai[model.lunban]
        const tingpai = Majiang.Util.tingpai(model.shoupai[model.lunban])

        if (Majiang.Util.xiangting(shoupai) == 0
            && tingpai
            && tingpai.find(p => model.he[model.lunban].find(p))) {
            this._neng_rong[model.lunban] = false;
        }

        this._dapai = dapai;

        let paipu = { dapai: { l: model.lunban, p: dapai } };
        this.add_paipu(paipu);

        if (this._gang) this.kaigang();

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.call_players('dapai', msg, null);

        if (this._view) this._view.update(paipu);
    }

    fulou(fulou: any) {

        let model = this._model;

        this._diyizimo = false;
        this._yifa = [0, 0, 0, 0];

        model.he[model.lunban].fulou(fulou);

        let d = fulou.match(/[\+\=\-]/);
        model.lunban = (model.lunban + '_-=+'.indexOf(d)) % 4;

        model.shoupai[model.lunban].fulou(fulou);

        if (fulou.match(/^[mpsz]\d{4}/)) {
            this._gang = fulou;
            this._n_gang[model.lunban]++;
        }

        let paipu = { fulou: { l: model.lunban, m: fulou } };
        this.add_paipu(paipu);

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.call_players('fulou', msg, null);

        if (this._view) this._view.update(paipu);
    }

    gang(gang: any) {

        let model = this._model;

        model.shoupai[model.lunban].gang(gang);

        let paipu = { gang: { l: model.lunban, m: gang } };
        this.add_paipu(paipu);

        if (this._gang) this.kaigang();

        this._gang = gang;
        this._n_gang[model.lunban]++;

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.call_players('gang', msg, null);

        if (this._view) this._view.update(paipu);
    }

    gangzimo() {

        let model = this._model;

        this._diyizimo = false;
        this._yifa = [0, 0, 0, 0];

        let zimo = model.shan.gangzimo();
        model.shoupai[model.lunban].zimo(zimo);

        let paipu = { gangzimo: { l: model.lunban, p: zimo } };
        this.add_paipu(paipu);

        if (!this._rule['カンドラ後乗せ'] ||
            this._gang.match(/^[mpsz]\d{4}$/)) this.kaigang();

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
            if (l != model.lunban) msg[l].gangzimo.p = '';
        }
        this.call_players('gangzimo', msg, null);

        if (this._view) this._view.update(paipu);
    }

    kaigang() {

        this._gang = null;

        if (!this._rule['カンドラあり']) return;

        let model = this._model;

        model.shan.kaigang();
        let baopai = model.shan.baopai.pop();

        let paipu = { kaigang: { baopai: baopai } };
        this.add_paipu(paipu);

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.notify_players('kaigang', msg);

        if (this._view) this._view.update(paipu);
    }

    hule() {

        let model = this._model;

        if (this._status != 'hule') {
            model.shan.close();
            this._hule_option = this._status == 'gang' ? 'qianggang'
                : this._status == 'gangzimo' ? 'lingshang'
                    : null;
        }

        let menfeng = this._hule.length ? this._hule.shift() : model.lunban;
        let rongpai = menfeng == model.lunban ? null
            : (this._hule_option == 'qianggang'
                ? this._gang[0] + this._gang.slice(-1)
                : this._dapai.slice(0, 2)
            ) + '_+=-'[(4 + model.lunban - menfeng) % 4];
        let shoupai = model.shoupai[menfeng].clone();
        let fubaopai = shoupai.lizhi ? model.shan.fubaopai : null;

        let param = {
            rule: this._rule,
            zhuangfeng: model.zhuangfeng,
            menfeng: menfeng,
            hupai: {
                lizhi: this._lizhi[menfeng],
                yifa: this._yifa[menfeng],
                qianggang: this._hule_option == 'qianggang',
                lingshang: this._hule_option == 'lingshang',
                haidi: model.shan.paishu > 0
                    || this._hule_option == 'lingshang' ? 0
                    : !rongpai ? 1
                        : 2,
                tianhu: !(this._diyizimo && !rongpai) ? 0
                    : menfeng == 0 ? 1
                        : 2
            },
            baopai: model.shan.baopai,
            fubaopai: fubaopai,
            jicun: {
                changbang: model.changbang,
                lizhibang: model.lizhibang
            }
        };
        let hule: any = Majiang.Util.hule(shoupai, rongpai, param)

        if (this._rule['連荘方式'] > 0 && menfeng == 0) this._lianzhuang = true;
        if (this._rule['場数'] == 0) this._lianzhuang = false;
        if (hule) this._fenpei = hule.fenpei;

        let paipu: Paipu = {
            hule: {
                l: menfeng,
                shoupai: rongpai ? shoupai.zimo(rongpai).toString()
                    : shoupai.toString(),
                baojia: rongpai ? model.lunban : null,
                fubaopai: fubaopai,
                fu: hule.fu,
                fanshu: hule.fanshu,
                damanguan: hule.damanguan,
                defen: hule.defen,
                hupai: hule.hupai,
                fenpei: hule.fenpei
            }
        };
        for (let key of ['fu', 'fanshu', 'damanguan']) {
            if (!paipu.hule[key]) delete paipu.hule[key];
        }
        this.add_paipu(paipu);

        let msg: Msg[] = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.call_players('hule', msg, this._wait);

        if (this._view) this._view.update(paipu);
    }

    pingju(name: any, shoupai = ['', '', '', '']) {

        let model = this._model;

        let fenpei = [0, 0, 0, 0];

        if (!name) {

            let n_tingpai = 0;
            for (let l = 0; l < 4; l++) {
                const tingpai = Majiang.Util.tingpai(model.shoupai[l])
                if (this._rule['ノーテン宣言あり'] && !shoupai[l]
                    && !model.shoupai[l].lizhi) continue;
                if (!this._rule['ノーテン罰あり']
                    && (this._rule['連荘方式'] != 2 || l != 0)
                    && !model.shoupai[l].lizhi) {
                    shoupai[l] = '';
                }
                else if (tingpai && Majiang.Util.xiangting(model.shoupai[l]) == 0
                    && tingpai.length > 0) {
                    n_tingpai++;
                    shoupai[l] = model.shoupai[l].toString();
                    if (this._rule['連荘方式'] == 2 && l == 0)
                        this._lianzhuang = true;
                }
                else {
                    shoupai[l] = '';
                }
            }
            if (this._rule['流し満貫あり']) {
                for (let l = 0; l < 4; l++) {
                    let all_yaojiu = true;
                    for (let p of model.he[l]._pai) {
                        if (p.match(/[\+\=\-]$/)) { all_yaojiu = false; break }
                        if (p.match(/^z/)) continue;
                        if (p.match(/^[mps][19]/)) continue;
                        all_yaojiu = false; break;
                    }
                    if (all_yaojiu) {
                        name = '流し満貫';
                        for (let i = 0; i < 4; i++) {
                            fenpei[i] += l == 0 && i == l ? 12000
                                : l == 0 ? -4000
                                    : l != 0 && i == l ? 8000
                                        : l != 0 && i == 0 ? -4000
                                            : -2000;
                        }
                    }
                }
            }
            if (!name) {
                name = '荒牌平局';
                if (this._rule['ノーテン罰あり']
                    && 0 < n_tingpai && n_tingpai < 4) {
                    for (let l = 0; l < 4; l++) {
                        fenpei[l] = shoupai[l] ? 3000 / n_tingpai
                            : -3000 / (4 - n_tingpai);
                    }
                }
            }
            if (this._rule['連荘方式'] == 3) this._lianzhuang = true;
        }
        else {
            this._no_game = true;
            this._lianzhuang = true;
        }

        if (this._rule['場数'] == 0) this._lianzhuang = true;

        this._fenpei = fenpei;

        let paipu = {
            pingju: { name: name, shoupai: shoupai, fenpei: fenpei }
        };
        this.add_paipu(paipu);

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.call_players('pingju', msg, this._wait);

        if (this._view) this._view.update(paipu);
    }

    last() {

        let model = this._model;

        model.lunban = -1;
        if (this._view) this._view.update();

        if (!this._lianzhuang) {
            model.jushu++;
            model.zhuangfeng += (model.jushu / 4) | 0;
            model.jushu = model.jushu % 4;
        }

        let jieju = false;
        let guanjun = -1;
        const defen = model.defen;
        for (let i = 0; i < 4; i++) {
            let id = (model.qijia + i) % 4;
            if (defen[id] < 0 && this._rule['トビ終了あり']) jieju = true;
            if (defen[id] >= 30000
                && (guanjun < 0 || defen[id] > defen[guanjun])) guanjun = id;
        }

        let sum_jushu = model.zhuangfeng * 4 + model.jushu;

        if (15 < sum_jushu) jieju = true;
        else if ((this._rule['場数'] + 1) * 4 - 1 < sum_jushu) jieju = true;
        else if (this._max_jushu < sum_jushu) {
            if (this._rule['延長戦方式'] == 0) jieju = true;
            else if (this._rule['場数'] == 0) jieju = true;
            else if (guanjun >= 0) jieju = true;
            else {
                this._max_jushu += this._rule['延長戦方式'] == 3 ? 4
                    : this._rule['延長戦方式'] == 2 ? 1
                        : 0;
            }
        }
        else if (this._max_jushu == sum_jushu) {
            if (this._rule['オーラス止めあり'] && guanjun == model.player_id[0]
                && this._lianzhuang && !this._no_game) jieju = true;
        }

        if (jieju) this.delay(() => this.jieju(), 0);
        else this.delay(() => this.qipai(null), 0);
    }

    jieju() {

        let model = this._model;

        let paiming: any = [];
        const defen = model.defen;
        for (let i = 0; i < 4; i++) {
            let id = (model.qijia + i) % 4;
            for (let j = 0; j < 4; j++) {
                if (j == paiming.length || defen[id] > defen[paiming[j]]) {
                    paiming.splice(j, 0, id);
                    break;
                }
            }
        }
        defen[paiming[0]] += model.lizhibang * 1000;
        this._paipu.defen = defen;

        let rank = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            rank[paiming[i]] = i + 1;
        }
        this._paipu.rank = rank;

        const round = !this._rule['順位点'].find((p: any) => p.match(/\.\d$/));
        let point = [0, 0, 0, 0];
        for (let i = 1; i < 4; i++) {
            let id = paiming[i];
            point[id] = (defen[id] - 30000) / 1000
                + + this._rule['順位点'][i];
            if (round) point[id] = Math.round(point[id]);
            point[paiming[0]] -= point[id];
        }
        this._paipu.point = point.map(p => p.toFixed(round ? 0 : 1));

        let paipu = { jieju: this._paipu };

        let msg = [];
        for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
        }
        this.call_players('jieju', msg, this._wait);

        if (this._view) this._view.summary(this._paipu);

        if (this._handler) this._handler();
    }

    get_reply(l: any) {
        let model = this._model;
        return this._reply[model.player_id[l]];
    }

    reply_kaiju() { this.delay(() => this.qipai(null), 0) }

    reply_qipai() { this.delay(() => this.zimo(), 0) }

    reply_zimo() {
        let model = this._model;

        let reply = this.get_reply(model.lunban);
        if (reply.daopai) {
            if (this.allow_pingju()) {
                let shoupai = ['', '', '', ''];
                shoupai[model.lunban] = model.shoupai[model.lunban].toString();
                return this.delay(() => this.pingju('九種九牌', shoupai), 0);
            }
        }
        else if (reply.hule) {
            if (this.allow_hule(null)) {
                this.say('zimo', model.lunban);
                return this.delay(() => this.hule(), null);
            }
        }
        else if (reply.gang) {
            if (this.get_gang_mianzi(null).find((m: any) => m == reply.gang)) {
                this.say('gang', model.lunban);
                return this.delay(() => this.gang(reply.gang), null);
            }
        }
        else if (reply.dapai) {
            let dapai = reply.dapai.replace(/\*$/, '');
            if (this.get_dapai().find((p: any) => p == dapai)) {
                if (reply.dapai.slice(-1) == '*' && this.allow_lizhi(dapai)) {
                    this.say('lizhi', model.lunban);
                    return this.delay(() => this.dapai(reply.dapai), null);
                }
                return this.delay(() => this.dapai(dapai), 0);
            }
        }

        let p = this.get_dapai().pop();
        this.delay(() => this.dapai(p), 0);
    }

    reply_dapai() {
        let model = this._model;

        for (let i = 1; i < 4; i++) {
            let l = (model.lunban + i) % 4;
            let reply = this.get_reply(l);
            if (reply.hule && this.allow_hule(l)) {
                if (this._rule['最大同時和了数'] == 1 && this._hule.length)
                    continue;
                this.say('rong', l);
                this._hule.push(l);
            }
            else {
                let shoupai = model.shoupai[l].clone().zimo(this._dapai);
                if (Majiang.Util.xiangting(shoupai) == -1)
                    this._neng_rong[l] = false;
            }
        }
        if (this._hule.length == 3 && this._rule['最大同時和了数'] == 2) {
            let shoupai = ['', '', '', ''];
            for (let l of this._hule) {
                shoupai[l] = model.shoupai[l].toString();
            }
            return this.delay(() => this.pingju('三家和', shoupai), null);
        }
        else if (this._hule.length) {
            return this.delay(() => this.hule(), null);
        }

        if (this._dapai.slice(-1) == '*') {
            model.defen[model.player_id[model.lunban]] -= 1000;
            model.lizhibang++;

            if (this._lizhi.filter((x: any) => x).length == 4
                && this._rule['途中流局あり']) {
                let shoupai = model.shoupai.map((s: any) => s.toString());
                return this.delay(() => this.pingju('四家立直', shoupai), null);
            }
        }

        if (this._diyizimo && model.lunban == 3) {
            this._diyizimo = false;
            if (this._fengpai) {
                return this.delay(() => this.pingju('四風連打'), 0);
            }
        }

        if (this._n_gang.reduce((x: any, y: any) => x + y) == 4) {
            if (Math.max(...this._n_gang) < 4 && this._rule['途中流局あり']) {
                return this.delay(() => this.pingju('四開槓'), 0);
            }
        }

        if (!model.shan.paishu) {
            let shoupai = ['', '', '', ''];
            for (let l = 0; l < 4; l++) {
                let reply = this.get_reply(l);
                if (reply.daopai) shoupai[l] = reply.daopai;
            }
            return this.delay(() => this.pingju('', shoupai), 0);
        }

        for (let i = 1; i < 4; i++) {
            let l = (model.lunban + i) % 4;
            let reply = this.get_reply(l);
            if (reply.fulou) {
                let m = reply.fulou.replace(/0/g, '5');
                if (m.match(/^[mpsz](\d)\1\1\1/)) {
                    if (this.get_gang_mianzi(l).find((m: any) => m == reply.fulou)) {
                        this.say('gang', l);
                        return this.delay(() => this.fulou(reply.fulou), null);
                    }
                }
                else if (m.match(/^[mpsz](\d)\1\1/)) {
                    if (this.get_peng_mianzi(l).find((m: any) => m == reply.fulou)) {
                        this.say('peng', l);
                        return this.delay(() => this.fulou(reply.fulou), null);
                    }
                }
            }
        }
        let l = (model.lunban + 1) % 4;
        let reply = this.get_reply(l);
        if (reply.fulou) {
            if (this.get_chi_mianzi(l).find((m: any) => m == reply.fulou)) {
                this.say('chi', l);
                return this.delay(() => this.fulou(reply.fulou), null);
            }
        }

        this.delay(() => this.zimo(), 0);
    }

    reply_fulou() {

        let model = this._model;

        if (this._gang) {
            return this.delay(() => this.gangzimo(), 0);
        }

        let reply = this.get_reply(model.lunban);
        if (reply.dapai) {
            if (this.get_dapai().find((p: any) => p == reply.dapai)) {
                return this.delay(() => this.dapai(reply.dapai), 0);
            }
        }

        let p = this.get_dapai().pop();
        this.delay(() => this.dapai(p), 0);
    }

    reply_gang() {

        let model = this._model;

        if (this._gang.match(/^[mpsz]\d{4}$/)) {
            return this.delay(() => this.gangzimo(), 0);
        }

        for (let i = 1; i < 4; i++) {
            let l = (model.lunban + i) % 4;
            let reply = this.get_reply(l);
            if (reply.hule && this.allow_hule(l)) {
                if (this._rule['最大同時和了数'] == 1 && this._hule.length)
                    continue;
                this.say('rong', l);
                this._hule.push(l);
            }
            else {
                let p = this._gang[0] + this._gang.slice(-1);
                let shoupai = model.shoupai[l].clone().zimo(p);
                if (Majiang.Util.xiangting(shoupai) == -1)
                    this._neng_rong[l] = false;
            }
        }
        if (this._hule.length) {
            return this.delay(() => this.hule(), null);
        }

        this.delay(() => this.gangzimo(), 0);
    }

    reply_hule() {

        let model = this._model;

        for (let l = 0; l < 4; l++) {
            model.defen[model.player_id[l]] += this._fenpei[l];
        }
        model.changbang = 0;
        model.lizhibang = 0;

        if (this._hule.length) {
            return this.delay(() => this.hule(), null);
        }
        else {
            if (this._lianzhuang) model.changbang = this._changbang + 1;
            return this.delay(() => this.last(), 0);
        }
    }

    reply_pingju() {

        let model = this._model;

        for (let l = 0; l < 4; l++) {
            model.defen[model.player_id[l]] += this._fenpei[l];
        }
        model.changbang++;

        this.delay(() => this.last(), 0);
    }

    get_dapai() {
        let model = this._model;
        return Player.get_dapai(this._rule, model.shoupai[model.lunban]);
    }

    get_chi_mianzi(l: any) {
        let model = this._model;
        let d = '_+=-'[(4 + model.lunban - l) % 4];
        return Player.get_chi_mianzi(this._rule, model.shoupai[l],
            this._dapai + d, model.shan.paishu);
    }

    get_peng_mianzi(l: any) {
        let model = this._model;
        let d = '_+=-'[(4 + model.lunban - l) % 4];
        return Player.get_peng_mianzi(this._rule, model.shoupai[l],
            this._dapai + d, model.shan.paishu);
    }

    get_gang_mianzi(l: any) {
        let model = this._model;
        if (l == null) {
            return Player.get_gang_mianzi(this._rule, model.shoupai[model.lunban],
                null, model.shan.paishu,
                this._n_gang.reduce((x: any, y: any) => x + y));
        }
        else {
            let d = '_+=-'[(4 + model.lunban - l) % 4];
            return Player.get_gang_mianzi(this._rule, model.shoupai[l],
                this._dapai + d, model.shan.paishu,
                this._n_gang.reduce((x: any, y: any) => x + y));
        }
    }

    allow_lizhi(p: any) {
        let model = this._model;
        return Player.allow_lizhi(this._rule, model.shoupai[model.lunban],
            p, model.shan.paishu,
            model.defen[model.player_id[model.lunban]]);
    }

    allow_hule(l: any) {
        let model = this._model;
        if (l == null) {
            let hupai = model.shoupai[model.lunban].lizhi
                || this._status == 'gangzimo'
                || model.shan.paishu == 0;
            return Player.allow_hule(this._rule,
                model.shoupai[model.lunban], null,
                model.zhuangfeng, model.lunban, hupai, null);
        }
        else {
            let p = (this._status == 'gang'
                ? this._gang[0] + this._gang.slice(-1)
                : this._dapai
            ) + '_+=-'[(4 + model.lunban - l) % 4];
            let hupai = model.shoupai[l].lizhi
                || this._status == 'gang'
                || model.shan.paishu == 0;
            return Player.allow_hule(this._rule,
                model.shoupai[l], p,
                model.zhuangfeng, l, hupai,
                this._neng_rong[l]);
        }
    }

    allow_pingju() {
        let model = this._model;
        return Player.allow_pingju(this._rule, model.shoupai[model.lunban],
            this._diyizimo);
    }
}

interface Hule {
    l?: any;
    shoupai?: any;
    baojia?: any;
    fubaopai?: any;
    fu?: any;
    fanshu?: any;
    damanguan?: any;
    defen?: any;
    hupai?: any;
    fenpei?: any;
    [key: string]: any;  // 任意の文字列キーに対応するany型のインデックスシグネチャを追加
}

interface Paipu {
    hule: Hule;
}