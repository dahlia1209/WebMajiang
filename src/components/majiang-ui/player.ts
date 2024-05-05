/*
 *  Majiang.UI.Player
 */
"use strict";

import $ from 'jquery';
import * as Majiang from "../majiang-core/index"
import { hide, show,fadeIn } from "./fadein"
import {setSelector, clearSelector  } from "./selector"
import {mianzi } from "./mianzi"

export class Player extends Majiang.Player {
    constructor(root: JQuery<HTMLElement>, pai:any, audio:any) {
        super();
        this._node = {
            root:   root,
            timer:  $('.timer', root),
            button: $('.player-button', root),
            mianzi: $('.select-mianzi', root),
            dapai:  $('.shoupai.main .bingpai', root),
        };
        this._mianzi = mianzi(pai);

        this.sound_on = true;
        this._audio   = { beep: audio('beep') };

        this.clear_handler();
    }

    clear_handler() {
        this.clear_button();
        this.clear_mianzi();
        this.clear_dapai();
        clearSelector('kaiju');
        clearSelector('dialog');
        clearSelector('summary');
    }

    callback(reply:any) {
        this.clear_timer();
        this.clear_handler();
        this._callback(reply);
        return false;
    }

    set_button(type:any, callback:any) {
        show($(`.${type}`, this._node.button)
                .attr('tabindex', 0)
                .on('click.button', callback));
        this._show_button = true;
    }

    show_button(callback = ()=>{}) {
        this.show_timer();
        if (! this._show_button) return callback();
        const handler = ()=>{ this.clear_button(); callback() };
        this.set_button('cansel', handler);
        this._node.root.on('click.button', handler);

        show(this._node.button.width($(this._node.dapai).width()));
        setSelector($('.button[tabindex]', this._node.button),
                    'button', {focus: -1, touch: false});
    }

    clear_button() {
        hide($('.button', this._node.button));
        clearSelector('button');
        hide(this._node.button);
        this._node.root.off('.button');
        this._show_button = false;
    }

    select_mianzi(mianzi:any) {
        this.clear_button();
        this._node.mianzi.empty();
        for (let m of mianzi) {
            let msg = m.match(/\d/g).length == 4 ? {gang: m} : {fulou: m}
            if (! this._default_reply) this._default_reply = msg;
            this._node.mianzi.append(
                    this._mianzi(m, true)
                        .on('click.mianzi',()=>this.callback(msg)));
        }
        show(this._node.mianzi.width($(this._node.dapai).width()));
        setSelector($('.mianzi', this._node.mianzi), 'mianzi',
                    {touch: false, focus: null});
        return false;
    }

    clear_mianzi() {
        setTimeout(()=>hide(this._node.mianzi), 400);
        clearSelector('mianzi');
    }

    select_dapai(lizhi?:any) {
        if (lizhi) this._default_reply = { dapai: lizhi[0] + '*' };

        for (let p of lizhi || this.get_dapai(this.shoupai)) {
            let pai = $(p.slice(-1) == '_'
                            ? `.zimo .pai[data-pai="${p.slice(0,2)}"]`
                            : `> .pai[data-pai="${p}"]`,
                        this._node.dapai);
            if (lizhi) {
                pai.addClass('blink');
                p += '*';
            }
            pai.attr('tabindex', 0).attr('role','button')
                .on('click.dapai', (ev:any)=>{
                    $(ev.target).addClass('dapai');
                    this.callback({dapai: p});
                });
        }

        setSelector($('.pai[tabindex]', this._node.dapai),
                    'dapai', {focus: -1});
    }

    clear_dapai() {
        $('.pai', this._node.dapai).removeClass('blink');
        clearSelector('dapai');
    }

    set_timer(limit:any, allowed = 0, audio:any) {

        delete this._default_reply;

        let time_limit = Date.now() + (limit + allowed) * 1000;

        if (this._timer_id) clearInterval(this._timer_id);
        this._timer_id = setInterval(()=>{
            if (time_limit <= Date.now()) {
                this.callback(this._default_reply);
                return;
            }
            let time = Math.ceil((time_limit - Date.now()) / 1000);
            if (time <= limit || time <= allowed) {
                if (time != this._node.timer.text()) {
                    if (this.sound_on && audio && time <= 5) {
                        audio.currentTime = 0;
                        audio.play();
                    }
                    this._node.timer.text(time);
                }
            }
        }, 200);
    }

    show_timer() {
        const j:any=$(this._node.dapai)
        show(this._node.timer.width(j.width() + 20));
    }

    clear_timer() {
        this._timer_id = clearInterval(this._timer_id);
        hide(this._node.timer.text(''));
    }

    action(msg:any, callback:any) {
        let limit, allowed;
        if (msg.timer) [ limit, allowed ] = msg.timer;
        let audio = ! (msg.kaiju || msg.hule || msg.pingju) && this._audio.beep;
        if (limit) this.set_timer(limit, allowed, audio);

        super.action(msg, callback);
    }

    action_kaiju(kaiju:any) {
        if (! this._view) this.callback(null);
        $('.kaiju', this._node.root).off('click')
                                    .on('click.kaiju', ()=>this.callback(null));
        setTimeout(()=>{
            setSelector($('.kaiju', this._node.root), 'kaiju',
                        { touch: false });
        }, 800);
    }

    action_qipai(qipai:any) { this.callback(null) }

    action_zimo(zimo:any, gangzimo:any) {
        if (zimo.l != this._menfeng) return this.callback(null);

        if (this.allow_hule(this.shoupai, null, gangzimo)) {
            this.set_button('zimo', ()=>this.callback({hule: '-'}));
        }

        if (this.allow_pingju(this.shoupai)) {
            this.set_button('pingju', ()=>this.callback({daopai: '-'}));
        }

        let gang_mianzi = this.get_gang_mianzi(this.shoupai,null);
        if (gang_mianzi.length == 1) {
            this.set_button('gang', ()=>this.callback({gang: gang_mianzi[0]}));
        }
        else if (gang_mianzi.length > 1) {
            this.set_button('gang', ()=>this.select_mianzi(gang_mianzi));
        }

        if (this.shoupai.lizhi) {
            this.show_button(()=>this.callback({dapai: zimo.p + '_'}));
            return;
        }

        let lizhi_dapai:any = this.allow_lizhi(this.shoupai,null);
        if (lizhi_dapai.length) {
            this.set_button('lizhi', ()=>{
                this.clear_handler();
                this.select_dapai(lizhi_dapai);
            });
        }

        this.show_button(()=>this.select_dapai());
    }

    action_dapai(dapai:any):any {

        if (this.allow_no_daopai(this.shoupai)) {
            this.set_button('daopai', ()=>this.callback(null));
        }

        if (dapai.l == this._menfeng) {

            if (! this._show_button) return this.callback(null);

            setTimeout(()=>{
                this.show_button(()=>this.callback({daopai: '-'}))
            }, 500);
            return;
        }
        const lunban =this._model.lunban;
        let d = lunban===undefined?undefined: ['','+','=','-'][(4 + lunban - this._menfeng) % 4];
        let p = dapai.p + d;

        if (this.allow_hule(this.shoupai, p,null)) {
            this.set_button('rong', ()=>this.callback({hule: '-'}));
        }

        let gang_mianzi = this.get_gang_mianzi(this.shoupai, p);
        if (gang_mianzi.length == 1) {
            this.set_button('gang', ()=>this.callback({fulou: gang_mianzi[0]}));
        }

        let peng_mianzi = this.get_peng_mianzi(this.shoupai, p);
        if (peng_mianzi.length == 1) {
            this.set_button('peng', ()=>this.callback({fulou: peng_mianzi[0]}));
        }
        else if (peng_mianzi.length > 1) {
            this.set_button('peng', ()=>this.select_mianzi(peng_mianzi));
        }

        let chi_mianzi = this.get_chi_mianzi(this.shoupai, p);
        if (chi_mianzi.length == 1) {
            this.set_button('chi', ()=>this.callback({fulou: chi_mianzi[0]}));
        }
        else if (chi_mianzi.length > 1) {
            this.set_button('chi', ()=>this.select_mianzi(chi_mianzi));
        }

        this.show_button(()=>{
            if (this._model.shan && this._model.shan.paishu == 0
                && Majiang.Util.xiangting(this.shoupai) == 0)
                    this.callback({daopai: '-'});
            else    this.callback(null);
        });
    }

    action_fulou(fulou:any) {
        if (fulou.l != this._menfeng) return this.callback(null);
        if (fulou.m.match(/^[mpsz]\d{4}/)) return this.callback(null);

        this.show_button(()=>this.select_dapai(null));
    }

    action_gang(gang:any) {
        if (gang.l == this._menfeng) return this.callback(null);
        if (gang.m.match(/^[mpsz]\d{4}$/)) return this.callback(null);

        const lunban =this._model.lunban;
        let d = lunban===undefined?undefined: ['','+','=','-'][(4 + lunban - this._menfeng) % 4];
        let p = gang.m[0] + gang.m.slice(-1) + d;

        if (this.allow_hule(this.shoupai, p, true)) {
            this.set_button('rong', ()=>this.callback({hule: '-'}));
        }

        this.show_button(()=>this.callback(null));
    }

    action_hule(hule:any):any {
        $('.hule-dialog', this._node.root).off('click')
                                    .on('click.dialog', ()=>this.callback(null));
        setTimeout(()=>{
            setSelector($('.hule-dialog', this._node.root), 'dialog',
                        { touch: false });
        }, 800);
    }

    action_pingju(pingju:any) {
        this.action_hule(null);
    }

    action_jieju(jieju:any) {
        $('.summary', this._node.root).off('click')
                                    .on('click.summary', ()=>this.callback(null));
        setTimeout(()=>{
            setSelector($('.summary', this._node.root), 'summary',
                        { touch: false });
        }, 800);
    }
}
