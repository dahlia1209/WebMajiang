// fadein.ts
"use strict";

import $ from 'jquery';

const show = (node: JQuery): JQuery => {
    return node.removeClass('hide fadeout');
}

const hide = (node: JQuery): JQuery => {
    return node.addClass('hide fadeout');
}

const fadeIn = (node: JQuery): JQuery => {
    node.addClass('hide fadeout');
    setTimeout(() => {
        node.removeClass('hide');
        setTimeout(() =>
            node.off('transitionend')
                .removeClass('fadeout'), 0)
    }, 100);
    return node;
}

const fadeOut = (node: JQuery): JQuery =>
    node.on('transitionend', () =>
        node.off('transitionend')
            .addClass('hide'))
        .addClass('fadeout')

export {
    show,
    hide,
    fadeIn,
    fadeOut
}