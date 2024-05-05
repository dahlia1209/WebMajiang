/*
 *  Majiang.UI.audio
 */
"use strict";

import $ from 'jquery';

export function audio(loaddata:  JQuery<HTMLElement>) {
    const audios: { [key: string]: JQuery } = {};

    $('audio', loaddata).each((index:number, element:HTMLElement) => {
        const name = $(element).data('name');
        audios[name] = $(element);
    });

    return function(name: string): HTMLAudioElement {
        const newAudio: HTMLAudioElement = audios[name].clone()[0] as HTMLAudioElement;;
        const volume = audios[name].attr('volume');
        if (volume) {
            newAudio.oncanplaythrough = () => {
                newAudio.volume = +volume;
                newAudio.oncanplaythrough = null;
            };
        }
        return newAudio;
    }
}
