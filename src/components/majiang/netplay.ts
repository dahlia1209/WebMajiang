/*!
 *  電脳麻将: ネット対戦 v2.3.6
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";
import * as Majiang from './majiang'
import $ from 'jquery';
const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;
import io from 'socket.io-client';

import preset from './conf/rule.json';

const base = location.pathname.replace(/\/[^\/]*?$/,'');

let loaded:any;

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const analyzer = (kaiju:any)=>{
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
                                        ()=>$('body').removeClass('analyzer'));
    };
    const viewer = (paipu:any)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        return new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>fadeIn($('body').attr('class','file')),
                        analyzer);
    };
    const stat = (paipu_list:any)=>{
        fadeIn($('body').attr('class','stat'));
        return new Majiang.UI.PaipuStat($('#stat'), paipu_list,
                        ()=>fadeIn($('body').attr('class','file')));
    };
    const file = new Majiang.UI.PaipuFile($('#file'), 'Majiang.netplay',
                                            viewer, stat,null,null,null);
    let sock:any, myuid:any;

    function init() {

        sock = io('/', { path: `${base}/server/socket.io/`});

        sock.on('HELLO', hello);
        sock.on('ROOM', room);
        sock.on('START', start);
        sock.on('END', end);
        sock.on('ERROR', file.error);
        sock.on('disconnect', ()=>hide($('#file .netplay form.room')));

        hide($('#title .loading'));
    }

    function hello(user:any) {
        console.log("hello")
        if (! user) {
            $('body').attr('class','title');
            show($('#title .login'));
            return;
        }
        myuid = user.uid;
        show($('#file .netplay form'));
        fadeIn($('body').attr('class','file'));
        if (user.icon)
            $('#file .netplay img').attr('src', user.icon)
                                   .attr('title', user.uid);
        $('#file .netplay .name').text(user.name);
        file.redraw();
    }

    let row:any, src:any;

    function room(msg:any) {
        if (! row) {
            row = $('#room .user').eq(0);
            src = $('img', row).attr('src');
        }
        $('body').attr('class','room');
        $('#room input[name="room_no"]').val(msg.room_no);
        $('#room .room').empty();
        for (let user of msg.user) {
            let r = row.clone();
            if (user.icon) $('img', r).attr('src', user.icon)
                                      .attr('title', user.uid);
            else           $('img', r).attr('src', src);
            $('.name', r).text(user.name);
            if (msg.user[0].uid == myuid || user.uid == myuid )
                show($('input[name="quit"]', r).on('click', ()=> {
                        sock.emit('ROOM', msg.room_no, user.uid);
                        return false;
                    }));
            if (user.offline) r.addClass('offline');
            else              r.removeClass('offline');
            $('#room .room').append(r);
        }
        if (msg.user[0].uid == myuid) {
            show($('#room select[name="rule"]'));
            show($('#room input[name="timer"]'));
            show($('#room input[type="submit"]'));
        }
        else {
            hide($('#room select[name="rule"]'));
            hide($('#room input[name="timer"]'));
            hide($('#room input[type="submit"]'));
        }
    }

    function start() {

        const player = new Majiang.UI.Player($('#board'), pai, audio);
        player.view  = new Majiang.UI.Board($('#board .board'), pai, audio,
                                                player.model);

        const gameCtl = new Majiang.UI.GameCtl($('#board'), 'Majiang.pref',
                                                null, player, player._view);
        gameCtl._view.no_player_name = false;

        let players:any = [];

        $('#board .controller').removeClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        sock.off('ROOM');
        sock.on('GAME', (msg:any)=>{
            if (msg.players) {
                players = msg.players;
            }
            else if (msg.say) {
                player._view.say(msg.say.name, msg.say.l);
            }
            else if (msg.seq) {
                player.action(msg, (reply:any = {})=>{
                    reply.seq = msg.seq;
                    sock.emit('GAME', reply);
                });
            }
            else {
                player.action(msg,null);
                if (msg.kaiju && msg.kaiju.log) {
                    let log = msg.kaiju.log.pop();
                    for (let data of log) {
                        player.action(data,null);
                    }
                }
            }
            player._view.players(players);
        });
    }

    function end(paipu:any) {
        sock.removeAllListeners('GAME');
        sock.on('ROOM', room);
        if (paipu) file.add(paipu, 10);
        fadeIn($('body').attr('class','file'));
        file.redraw();
        $('#file input[name="room_no"]').val('');
    }

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append($('<option>')
                                .val('-').text('カスタムルール'));
    }

    $('#file form.room').on('submit', (ev)=>{
        let room = $('input[name="room_no"]', $(ev.target)).val();
        sock.emit('ROOM', room);
        return false;
    });
    $('#room form').on('submit', (ev)=>{
        let room = $('input[name="room_no"]', $(ev.target)).val();

        let rule:any = $('select[name="rule"]', $(ev.target)).val();
        rule = ! rule      ? {}
             : rule == '-' ? JSON.parse(
                                localStorage.getItem('Majiang.rule')||'{}')
             :               preset[(rule as 'Mリーグルール'|'Classicルール')];
        rule = Majiang.rule(rule);

        let timer:any = $('input[name="timer"]', $(ev.target)).val();
        timer = timer.match(/(\d+)/g);
        if (timer) timer = timer.map((t:any)=>+t);

        sock.emit('START', room, rule, timer);
        return false;
    });

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $(window).on('load', ()=>setTimeout(init, 500));
    if (loaded) $(window).trigger('load');

    $('#title .login form').each(function(){
        let method = $(this).attr('method')
        let url:any    = $(this).attr('action');
        fetch(url, { method: method, redirect: 'manual' }).then(res =>{
            if (res.status == 404) hide($(this));
        });
    });
});
$(window).on('load', ()=> loaded = true);
