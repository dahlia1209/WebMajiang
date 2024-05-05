/*!
 *  @kobalab/majiang-ui v1.3.1
 *
 *  Copyright(C) 2021 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/majiang-ui/blob/master/LICENSE
 */

"use strict";

import {fadeIn,fadeOut,hide,show} from "./fadein";
import {clearSelector, setSelector} from "./selector";
import {scale} from "./scale";
import { pai } from "./pai";
import { audio } from "./audio";
import { Shoupai } from "./shoupai";
import { He } from "./he";
import { Shan } from "./shan";
import { Board } from "./board";
import { HuleDialog } from "./dialog";
import { Player } from "./player";
import { GameCtl } from "./gamectl";
import { PaipuFile } from "./file";
import { Paipu } from "./paipu";
import { Analyzer } from "./analyzer";
import { PaipuStat } from "./stat";

const Util = {fadeIn,fadeOut,hide,show, clearSelector, setSelector, scale}

export {
    pai,
    audio,
    Shoupai,
    He,
    Shan,
    Board,
    HuleDialog,
    Player,
    GameCtl,
    PaipuFile,
    Paipu,
    Analyzer,
    PaipuStat,
    Util
}
