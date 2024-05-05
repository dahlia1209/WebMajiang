/*!
 *  電脳麻将 v2.3.6
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";
// global.Majiang = require('@kobalab/majiang-core');
// global.Majiang.AI = require('@kobalab/majiang-ai');
// global.Majiang.UI = require('@kobalab/majiang-ui');
// global.Majiang.VERSION = '2.3.6';
// global.jQuery  = require('jquery');
// global.$ = jQuery;
import {Board,Game,He,Player,Shan,Shoupai,Util,rule} from '../majiang-core/index';
import * as UI from '../majiang-ui/index';
import { Player as AI } from '../majiang-ai/player';
const VERSION ="2.3.6"
export{ 
    UI,
    AI,
    VERSION,
    Board,Game,He,Player,Shan,Shoupai,Util,rule    
}