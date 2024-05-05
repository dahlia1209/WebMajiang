/*!
 *  @kobalab/majiang-core v1.2.1
 *
 *  Copyright(C) 2021 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/majiang-core/blob/master/LICENSE
 */

"use strict";

import { getRules as rule } from './rule'
import { Shoupai } from './shoupai'
import { Shan } from './shan'
import { He } from './he'
import { Board } from './board'
import { Game } from './game'
import { Player } from './player'
import {tingpai,xiangting,xiangting_guoshi,xiangting_qidui,xiangting_yiban} from './xiangting'
import {hule,hule_mianzi,hule_param} from './hule'

const Util = {tingpai,xiangting,xiangting_guoshi,xiangting_qidui,xiangting_yiban,hule,hule_mianzi,hule_param}
export {
    rule,
    Shoupai,
    Shan,
    He,
    Board,
    Game,
    Player,
    Util
}

