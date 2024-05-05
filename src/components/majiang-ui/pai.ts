/*
 *  Majiang.UI.pai
 */
"use strict";

import $ from 'jquery';

export function pai(loaddata: JQuery<HTMLElement>): (p: string) => JQuery<HTMLElement> {
    const pai: { [key: string]: JQuery<HTMLElement> } = {};

    $('.pai', loaddata).each((index:number, element:HTMLElement) => {
        let p = $(element).data('pai');
        pai[p] = $(element);
    });

    return function (p: string): JQuery<HTMLElement> {
        return pai[p.slice(0, 2)].clone();
    }
}
