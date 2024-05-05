/*
 *  scale.js
 */
"use strict";

import $ from 'jquery';

function scale(board:any, space:any) {

    let dh = $('body').height();
    let bh = board.height();
    if (dh && bh > dh) {
        let scale  = dh / bh;
        let margin = (dh - bh) / 2;
        board.css('transform', `translate(0px, ${margin}px) scale(${scale})`);
        $(window).scrollTop(space.height());
    }
    else {
        board.css('transform', '');
    }
}

export { scale };
