/*
 *  Majiang.UI.Analyzer
 */
"use strict";

// const AI = require('@kobalab/majiang-ai');
import {Player as AI} from "../majiang-ai/player"
import  {hide,show} from "./fadein"
import  {Shoupai} from "./shoupai"
import * as Majiang from "../majiang-core/index"

export class Analyzer extends AI {
    public _node:any;
    public _pai:any;
    public close:any;

    constructor(root:any, kaiju:any, pai:any, callback:any) {
        super();
        this._node = {
            root:      root,
            shoupai:   $('> .shoupai', root),
            dapai:     $('> .dapai',   root),
            r_shoupai: $('> .shoupai .row', root).eq(0),
            r_dapai:   $('> .dapai   .row', root).eq(0),
        };
        this._pai  = pai;
        this.close = callback;
        this.action(kaiju);
    }

    id(id:any) {
        this.action({ kaiju: {
            id:     id,
            rule:   this._rule,
            title:  this._model.title,
            player: this._model.player,
            qijia:  this._model.qijia,
        }})
    }

    next(msg:any) {
        super.action(msg,null);
    }

    action(msg:any) {
        super.action(msg, ()=>{});
    }

    action_kaiju() { this.clear() }

    action_qipai() {
        this.redraw_shoupai([]);
        this.active(true);
    }

    action_zimo(zimo:any, gangzimo:any) {
        if (zimo.l != this._menfeng) {
            this.redraw_shoupai([]);
            return;
        }
        let info:any = [];
        if (this.select_hule(null, gangzimo, info)) {
            this.redraw_shoupai(info);
            this.active(true);
            return;
        }
        let m = this.select_gang(info);
        if (m) info.forEach((i:any)=>{ if (i.m == m) i.selected = true });
        let p = this.select_dapai(info).slice(0,2);
        if (! m) info.forEach((i:any)=>{ if (! i.m && i.p == p) i.selected = true });
        this.redraw_dapai(info);
    }

    action_dapai(dapai:any) {
        if (dapai.l == this._menfeng) {
            this.update_dapai(dapai.p.slice(0,2));
            return;
        }
        let info:any = [];
        if (this.select_hule(dapai, null, info)) {
            this.redraw_shoupai(info);
            this.active(true);
            return;
        }
        let m = this.select_fulou(dapai, info);
        if (! m) m = '';
        info.forEach((i:any)=>{ if (i.m == m) i.selected = true });
        this.redraw_shoupai(info);
    }

    action_fulou(fulou:any) {
        if (fulou.l != this._menfeng) {
            this.redraw_shoupai([]);
            return;
        }
        if (fulou.m.match(/\d{4}/)) return;
        let info:any = [];
        let p = this.select_dapai(info).slice(0,2);
        info.forEach((i:any)=>{ if (i.p == p) i.selected = true });
        this.redraw_dapai(info);
        this.active(true);
    }

    action_gang(gang:any) {
        if (gang.l == this._menfeng) {
            this.update_dapai(gang.m);
            return;
        }
        let info:any = [];
        if (this.select_hule(gang, true, info)) {
            this.redraw_shoupai(info);
            this.active(true);
            return;
        }
    }

    action_hule()   { this.clear() }
    action_pingju() { this.clear() }

    active(on:any) {
        if (on) this._node.root.addClass('active');
        else    this._node.root.removeClass('active');
    }

    clear() {
        this.active(false)
        hide(this._node.shoupai);
        hide(this._node.dapai);
    }

    redraw_shoupai(info:any) {

        show(this._node.shoupai.empty());
        hide(this._node.dapai);

        if (! info.length) {
            let n_xiangting = Majiang.Util.xiangting(this.shoupai);
            let paishu = this._suanpai.paishu_all();
            let ev     = this.eval_shoupai(this.shoupai, paishu,null);
            const tingpai:any=Majiang.Util.tingpai(this.shoupai)
            let n_tingpai = tingpai
                                .map((p:any) => this._suanpai._paishu[p[0]][p[1]])
                                .reduce((x:any, y:any)=> x + y, 0);
            info.push({
                m: '', n_xiangting: n_xiangting, n_tingpai: n_tingpai,
                ev: ev, shoupai: this.shoupai.toString(),
            });
        }

        const cmp = (a:any, b:any)=> a.selected ? -1
                           : b.selected ?  1
                           : b.ev - a.ev;
        for (let i of info.sort(cmp)) {
            let row = this._node.r_shoupai.clone();
            $('.xiangting', row).text(  i.n_xiangting <  0 ? '和了形'
                                      : i.n_xiangting == 0 ? '聴牌'
                                      : `${i.n_xiangting}向聴`);
            if (i.ev == null) {
                $('.eval', row).text('');
            }
            else if (i.n_xiangting > 2) {
                let x = i.ev - i.n_tingpai;
                $('.eval', row).text(x ? `${i.n_tingpai}(+${x})枚`
                                       : `${i.n_tingpai}枚`);
            }
            else {
                $('.eval', row).text(i.ev.toFixed(2));
            }
            new Shoupai($('.shoupai', row), this._pai,
                        Majiang.Shoupai.fromString(i.shoupai),null).redraw(true);
            let action = i.n_xiangting < 0                      ? '和了'
                       : ! i.m                                  ? ''
                       : i.m.match(/\d{4}/)                     ? 'カン'
                       : i.m.replace(/0/,'5').match(/(\d)\1\1/) ? 'ポン'
                       :                                          'チー';
            $('.action', row).text(action);

            this._node.shoupai.append(row);
        }

        if (info.length == 1) this.active(false);
        else                  this.active(true);
    }

    redraw_dapai(info:any) {

        hide(this._node.shoupai);
        if (info.length) show(this._node.dapai.empty());
        else             hide(this._node.dapai);

        const cmp = (a:any, b:any)=> a.selected ? -1
                           : b.selected ?  1
                           : b.ev - a.ev;
        for (let i of info.sort(cmp)) {
            let row = this._node.r_dapai.clone().removeClass('selected')
                                                .attr('data-dapai', i.m || i.p);
            $('.p', row).empty().append(this._pai(i.p));
            if (i.m) $('.p', row).append($('<span>').text('カン'));
            $('.xiangting', row).text(i.n_xiangting ? `${i.n_xiangting}向聴`
                                                    : '聴牌');
            if (i.ev == null) {
                $('.eval', row).text('オリ');
            }
            else if (i.n_xiangting > 2) {
                let x = i.ev > i.n_tingpai ? i.ev - i.n_tingpai : 0;
                $('.eval', row).text(x ? `${i.n_tingpai}(+${x})枚`
                                       : `${i.n_tingpai}枚`);
            }
            else {
                $('.eval', row).text(i.ev.toFixed(2));
            }
            $('.tingpai', row).empty();
            for (let p of i.tingpai || []) {
                $('.tingpai', row).append(this._pai(p));
            }
            if (i.n_xiangting <= 2 && i.ev != null) {
                $('.tingpai', row)
                    .append($('<span>').text(`(${i.n_tingpai}枚)`));
            }
            let weixian = i.weixian == null ? ''
                        : i.weixian >= 13.5 ? 'high'
                        : i.weixian >=  8.0 ? 'middle'
                        : i.weixian >=  3.0 ? 'low'
                        : i.weixian ==  0.0 ? 'none'
                        :                     '';
            $('.eval', row).removeClass('high middle low none')
                           .addClass(weixian);

            this._node.dapai.append(row);
        }

        if (this.shoupai.lizhi && info.length == 1) this.active(false);
        else                                        this.active(true);
    }

    update_dapai(p:any) {
        $(`.row[data-dapai="${p}"]`, this._node.dapai).addClass('selected');
    }
}
