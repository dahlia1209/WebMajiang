/*
 *  selector.js
 */
"use strict";
import $ from 'jquery';
let debug = 0;                                                      // for DEBUG
let counter = 0;                                                    // for DEBUG
const selectors:any = {};

function setSelector(list:any, namespace:any, param = {}) {

    clearSelector(namespace);

    let opt = {
        confirm: 'Enter', prev: 'ArrowLeft', next: 'ArrowRight',
        tabindex: 0, focus: 0, touch: true
    };
    Object.assign(opt, param);

    const c = ++counter;                                            // for DEBUG
    if (namespace[0] != '.') namespace = '.' + namespace;
    selectors[namespace] = list;

    let i:any   = null;
    let len = list.length

    function touchstart(ev:any) {
        if (opt.touch) {
            $(ev.target).off('touchstart' + namespace).trigger('focus');
            return false;
        }
        else {
            $(ev.target).trigger('focus');
        }
    }

    list.attr('tabindex', opt.tabindex).attr('role','button')
        .on('touchstart' + namespace, touchstart)
        .on('focus'      + namespace, (ev:any)=>{ i = list.index($(ev.target)) })
        .on('blur'       + namespace, (ev:any)=>{ i = null;
                        $(ev.target).on('touchstart' + namespace, touchstart)})
        .on('mouseover'  + namespace, (ev:any)=>$(ev.target).trigger('focus'))
        .on('mouseout'   + namespace, (ev:any)=>$(ev.target).trigger('blur'));

    if (opt.confirm) {
        $(window).on('keyup' + namespace, (ev:any)=>{
            if (debug) console.log(c, ev.type+namespace, ev.key, i);// for DEBUG
            if (ev.key == opt.confirm && i != null) {
                list.eq(i).trigger('click');
                return false;
            }
        });
    }
    if (opt.prev || opt.next) {
        $(window).on('keydown' + namespace, (ev:any)=>{
            if (debug) console.log(c, ev.type+namespace, ev.key, i);// for DEBUG
            if (ev.key == opt.prev) {
                i = (i == null) ? len - 1 :
                    (i <=    0) ?       0 : i - 1;
                list.eq(i).trigger('touchstart');
                return false;
            }
            else if (ev.key == opt.next) {
                i = (i ==    null) ?       0 :
                    (i >= len - 1) ? len - 1 : i + 1;
                list.eq(i).trigger('touchstart');
                return false;
            }
        });
    }
    if (opt.focus != null) {
        list.eq(opt.focus).trigger('touchstart');
    }
    if (debug) console.log('ON', c, namespace,                      // for DEBUG
                            $.data(window).events);                // for DEBUG
    return list;
}

function clearSelector(namespace:any) {
    if (namespace[0] != '.') namespace = '.' + namespace;
    if (! selectors[namespace]) return;
    selectors[namespace].removeAttr('tabindex role').off(namespace);
    $(window).off(namespace);
    delete selectors[namespace];
    if (debug) console.log('OFF', namespace);                       // for DEBUG
}

export {
    setSelector,
    clearSelector
}
