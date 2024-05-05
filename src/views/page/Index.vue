<template>
    <div id="loaderr" style="display: none" ref="loaderrElemRef">
        <p>
            プログラムのロードでエラーが発生しました。お使いのブラウザでは実行できない可能性があります。リロードして問題が解決しない場合は、Google Chromeなど最新のブラウザでアクセスしてみてください。
        </p>
    </div>

    <div id="title">
        <h1>
            <img src="@/assets/logo.png" alt="電脳麻将" />
        </h1>
        <div v-if="pageRef == 'autoplay'">自動対戦</div>
        <div v-else-if="pageRef == 'netplay'">ネット対戦</div>
        <div class="version">{{ Majiang.VERSION }}</div>
        <div class="loading">Loading data...</div>
        <div class="start hide" tabindex="0" role="button">START</div>
        <div class="login hide">
            <form class="local" method="POST" action="server/auth/">
                <input name="name" placeholder="プレーヤー名">
                <input name="passwd" type="hidden" value="*">
                <input type="submit" value="登録">
            </form>
            <form class="hatena" method="POST" action="server/auth/hatena">
                <img src="https://www.hatena.ne.jp/p/images/favicon.ico">
                <input type="submit" value="Hatenaで登録">
            </form>
            <form class="google" method="POST" action="server/auth/google">
                <img src="https://www.google.com/favicon.ico">
                <input type="submit" value="Googleで登録">
            </form>
        </div>

    </div>
    <div id="loaddata">
        <img class="pai" data-pai="m1" src="/src/assets/m1.gif" alt="イーワン">
        <img class="pai" data-pai="m2" src="/src/assets/m2.gif" alt="リャンワン">
        <img class="pai" data-pai="m3" src="/src/assets/m3.gif" alt="サンワン">
        <img class="pai" data-pai="m4" src="/src/assets/m4.gif" alt="スーワン">
        <img class="pai" data-pai="m5" src="/src/assets/m5.gif" alt="ウーワン">
        <img class="pai" data-pai="m6" src="/src/assets/m6.gif" alt="ローワン">
        <img class="pai" data-pai="m7" src="/src/assets/m7.gif" alt="チーワン">
        <img class="pai" data-pai="m8" src="/src/assets/m8.gif" alt="パーワン">
        <img class="pai" data-pai="m9" src="/src/assets/m9.gif" alt="キューワン">
        <img class="pai" data-pai="m0" src="/src/assets/m0.gif" alt="赤ウーワン">
        <br>
        <img class="pai" data-pai="p1" src="/src/assets/p1.gif" alt="イーピン">
        <img class="pai" data-pai="p2" src="/src/assets/p2.gif" alt="リャンピン">
        <img class="pai" data-pai="p3" src="/src/assets/p3.gif" alt="サンピン">
        <img class="pai" data-pai="p4" src="/src/assets/p4.gif" alt="スーピン">
        <img class="pai" data-pai="p5" src="/src/assets/p5.gif" alt="ウーピン">
        <img class="pai" data-pai="p6" src="/src/assets/p6.gif" alt="ローピン">
        <img class="pai" data-pai="p7" src="/src/assets/p7.gif" alt="チーピン">
        <img class="pai" data-pai="p8" src="/src/assets/p8.gif" alt="パーピン">
        <img class="pai" data-pai="p9" src="/src/assets/p9.gif" alt="キューピン">
        <img class="pai" data-pai="p0" src="/src/assets/p0.gif" alt="赤ウーピン">
        <br>
        <img class="pai" data-pai="s1" src="/src/assets/s1.gif" alt="イーソー">
        <img class="pai" data-pai="s2" src="/src/assets/s2.gif" alt="リャンソー">
        <img class="pai" data-pai="s3" src="/src/assets/s3.gif" alt="サンソー">
        <img class="pai" data-pai="s4" src="/src/assets/s4.gif" alt="スーソー">
        <img class="pai" data-pai="s5" src="/src/assets/s5.gif" alt="ウーソー">
        <img class="pai" data-pai="s6" src="/src/assets/s6.gif" alt="ローソー">
        <img class="pai" data-pai="s7" src="/src/assets/s7.gif" alt="チーソー">
        <img class="pai" data-pai="s8" src="/src/assets/s8.gif" alt="パーソー">
        <img class="pai" data-pai="s9" src="/src/assets/s9.gif" alt="キューソー">
        <img class="pai" data-pai="s0" src="/src/assets/s0.gif" alt="赤ウーソー">
        <br>
        <img class="pai" data-pai="z1" src="/src/assets/z1.gif" alt="トン">
        <img class="pai" data-pai="z2" src="/src/assets/z2.gif" alt="ナン">
        <img class="pai" data-pai="z3" src="/src/assets/z3.gif" alt="シャー">
        <img class="pai" data-pai="z4" src="/src/assets/z4.gif" alt="ペー">
        <img class="pai" data-pai="z5" src="/src/assets/z5.gif" alt="ハク">
        <img class="pai" data-pai="z6" src="/src/assets/z6.gif" alt="ハツ">
        <img class="pai" data-pai="z7" src="/src/assets/z7.gif" alt="チュン">
        <img class="pai" data-pai="_" src="/src/assets/pai.gif" alt="">
        <br>
        <audio data-name="dapai" src="/src/assets/dahai11.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="chi" src="/src/assets/chii.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="peng" src="/src/assets/pon.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="gang" src="/src/assets/kan.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="rong" src="/src/assets/ron.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="zimo" src="/src/assets/tsumo.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="lizhi" src="/src/assets/richi.wav" volume="0.2" preload="auto"></audio>
        <audio data-name="gong" src="/src/assets/nc43994.wav" volume="1" preload="auto"></audio>
        <audio data-name="beep" src="/src/assets/beep.wav" volume="0.2" preload="auto"></audio>
    </div>
    <div id="file">
        <h1>
            <img src="@/assets/logo.png" alt="電脳麻将">
            <template v-if="pageRef == 'paipu'">牌譜ビューア</template>
            <template v-else-if="pageRef == 'netplay'">ネット対戦</template>
        </h1>
        <div class="version">{{ Majiang.VERSION }}</div>

        <div class="file hide">
            <template v-if="pageRef == 'index'">
                <a class="start">対局開始</a>
            </template>
            <template v-if="pageRef == 'netplay'">
                <div class="error hide"></div>
                <div class="netplay">
                    <img src="@/assets/icon.png" title="guest">
                    <span class="name"></span>
                    <form class="room">
                        <input name="room_no" placeholder="ルーム">
                        <input type="submit" value="入室">
                    </form>
                    <form class="room">
                        <input type="submit" value="ルーム作成">
                    </form>
                    <form class="logout" method="POST" action="server/logout">
                        <input type="submit" value="ログアウト">
                    </form>
                </div>
            </template>
            <template v-if="pageRef == 'index' || pageRef == 'netplay'">
                <div class="button">
                    <a class="stat">
                        <img src="@/assets/icon-dotlist.png">牌譜集計</a>
                    <a class="download">
                        <img src="@/assets/icon-download-alt.png">牌譜保存</a>
                </div>
            </template>
            <div class="list">
                <div class="row">
                    <div class="button">
                        <a class="replay">
                            <img src="@/assets/icon-play.png">再生</a>
                        <a class="download">
                            <img src="@/assets/icon-download-alt.png">保存</a>
                        <a class="delete">
                            <img src="@/assets/icon-trash.png">削除</a>
                        <template v-if="pageRef == 'paipu'">
                            <span class="move">
                                <img src="@/assets/icon-resize-vertical.png">
                            </span>
                        </template>
                    </div>
                    <div class="content">
                        <div class="title"></div>
                        <div class="player"></div>
                    </div>
                </div>
            </div>
            <template v-if="pageRef == 'paipu'">
                <div class="error hide"></div>
                <label class="upload">
                    <img src="@/assets//icon-upload-alt.png" alt="Upload">牌譜追加
                    <input type="file" multiple>
                </label>
                <label class="storage">
                    <input type="checkbox" name="storage">ローカルストレージ
                </label>
                <div class="button">
                    <a class="stat">
                        <img src="@/assets//icon-dotlist.png" alt="Stats">牌譜集計
                    </a>
                    <a class="download">
                        <img src="@/assets//icon-download-alt.png" alt="Download">牌譜保存
                    </a>
                </div>
                <form class="tenhou hide">天鳳 牌譜ID:
                    <input type="text" name="url">
                </form>
            </template>

        </div>
    </div>
    <div id="stat">
        <h1>
            <img src="@/assets/logo.png" alt="電脳麻将">牌譜集計
        </h1>
        <div class="version">{{ Majiang.VERSION }}</div>

        <div class="stat">
            <div>
                <div class="button">
                    <label class="cut-off">
                        <input name="cut-off" type="checkbox">対戦数
                        <input name="n_game">以下は表示しない
                    </label>
                    <a class="file">
                        <img src="@/assets/icon-arrow-left.png">牌譜一覧
                    </a>
                </div>
                <h2 class="title"></h2>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th><a>対戦</a></th>
                            <th><a>ポイント</a></th>
                            <th><a>順位</a></th>
                            <th><a>トップ</a></th>
                            <th><a>連対</a></th>
                            <th><a>ラス</a></th>
                            <th><a>和了</a></th>
                            <th><a>放銃</a></th>
                            <th><a>立直</a></th>
                            <th><a>副露</a></th>
                            <th><a>打点</a></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="name"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                            <td class="num"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div id="board">
        <div class="board">
            <div class="score">
                <div class="juchang">
                    <div class="jushu"></div>
                    <div class="jicun">
                        <img class="chouma" src="@/assets/100.gif" alt="本場"> :
                        <span class="changbang"></span>
                        <br>
                        <img class="chouma" src="@/assets/1000.gif" alt="供託"> :
                        <span class="lizhibang"></span>
                    </div>
                </div>
                <div class="shan">
                    <div class="baopai"></div>
                    <div>牌数:
                        <span class="paishu"></span>
                    </div>
                </div>
                <div class="defen">
                    <div class="main"></div>
                    <div class="xiajia"></div>
                    <div class="duimian"></div>
                    <div class="shangjia"></div>
                </div>
            </div>
            <div class="timer hide"></div>
            <div class="player-button hide">
                <span class="button cansel" aria-label="キャンセル">×</span>
                <span class="button daopai">ノー聴</span>
                <span class="button chi">チー</span>
                <span class="button peng">ポン</span>
                <span class="button gang">カン</span>
                <span class="button lizhi">リーチ</span>
                <span class="button rong">ロン</span>
                <span class="button zimo">ツモ</span>
                <span class="button pingju">流局</span>
            </div>
            <div class="select-mianzi hide"></div>
            <template v-for="lunban in lunbans">
                <div :class="`player ${lunban}`"></div>
                <div :class="`shoupai ${lunban}`">
                    <div class="bingpai"></div>
                    <div class="fulou"></div>
                </div>
                <div :class="`he ${lunban}`">
                    <div class="lizhi">
                        <img class="chouma hide" src="@/assets/1000.gif">
                    </div>
                    <div class="dapai"></div>
                </div>
                <div :class="`say ${lunban}`"></div>
            </template>
            <div class="hule-dialog hide">
                <div>
                    <div>
                        <div class="hule">
                            <div class="shan baopai">
                                <span class="baopai"></span>
                            </div>
                            <div class="shan fubaopai">
                                <span class="fubaopai"></span>
                            </div>
                            <div class="shoupai">
                                <div class="bingpai"></div>
                                <div class="fulou"></div>
                            </div>
                            <table class="hupai">
                                <tbody>
                                    <tr class="r_hupai">
                                        <td class="name"></td>
                                        <td class="fanshu"></td>
                                    </tr>
                                    <tr class="r_defen">
                                        <td class="defen" colspan="2"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="jicun">
                                <img class="chouma" src="@/assets/100.gif" alt="本場" /> :
                                <span class="changbang"></span>
                                <img class="chouma" src="@/assets/1000.gif" alt="供託" /> :
                                <span class="lizhibang"></span>
                            </div>
                        </div>
                        <div class="pingju"></div>
                        <div class="fenpei">
                            <template v-for="lunban in lunbans">
                                <div :class="lunban">
                                    <span class="feng"></span>:
                                    <span class="player"></span>
                                    <span class="defen"></span>
                                    <span class="diff"></span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="summary">
                <div>
                    <div>
                        <table>
                            <thead>
                                <tr class="r_player">
                                    <td colspan="3"></td>
                                    <th v-for="n in 4" class="player"></th>
                                </tr>
                            </thead>
                            <tbody class="body">
                                <tr class="r_diff">
                                    <th class="jushu"></th>
                                    <th class="changbang"></th>
                                    <th class="last"></th>
                                    <td v-for="n in 4" class="back">
                                        <span class="diff"></span>
                                        <span class="lizhi"></span>
                                    </td>

                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="r_defen">
                                    <td colspan="3"></td>
                                    <td v-for="n in 4" class="defen"></td>
                                </tr>
                                <tr class="r_point">
                                    <td colspan="3"></td>
                                    <td v-for="n in 4" class="point"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div class="kaiju">
                <div>
                    <div class="title"></div>
                    <div class="player">
                        <div v-for="lunban in lunbans" :class="lunban"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="analyzer">
            <table class="shoupai">
                <tr class="row">
                    <td class="xiangting"></td>
                    <td class="eval"></td>
                    <td>
                        <div class="shoupai">
                            <div class="bingpai"></div>
                            <div class="fulou"></div>
                        </div>
                    </td>
                    <td class="action"></td>
                </tr>
            </table>
            <table class="dapai">
                <tr class="row">
                    <td class="p"></td>
                    <td class="xiangting"></td>
                    <td class="eval"></td>
                    <td class="tingpai"></td>
                </tr>
            </table>
        </div>
        <div class="controller">
            <img class="exit" src="@/assets/icon-exit.png" title="終了 [q]">
            <img class="summary" src="@/assets/icon-list.png" title="集計表示 [?]">
            <img class="sound on" src="@/assets/icon-volume-up.png" title="音声OFF [a]">
            <img class="sound off" src="@/assets/icon-mutealt.png" title="音声ON [a]">
            <img class="analyzer" src="@/assets/icon-lightbulb-idea.png" title="検討ON/OFF [i]">
            <div></div>
            <img class="first" src="@/assets/icon-step-backward.png" title="配牌/前局 [←]">
            <img class="prev" src="@/assets/icon-backward.png" title="戻る [↑]">
            <img class="play on" src="@/assets/icon-play.png" title="再開 [space]">
            <img class="play off" src="@/assets/icon-pause.png" title="停止 [space]">
            <img class="next" src="@/assets/icon-forward.png" title="進む [↓]">
            <img class="last" src="@/assets/icon-step-forward.png" title="結果/次局 [→]">
            <div class="speed">
                <img class="minus" src="@/assets/icon-minus-sign.png" title="速度- [-]">
                <span v-for="n in 5"></span>
                <img class="plus" src="@/assets/icon-plus-sign.png" title="速度+ [+]">
            </div>
        </div>
        <div class="download hide">
            <a>
                <img src="@/assets/icon-download-alt.png">牌譜保存
            </a>
        </div>
    </div>
    <div class="version">ver. {{ Majiang.VERSION }}</div>
    <div>
        <template v-if="loginStatus === 'logout'" v-for="social in socials">
            <button :class="$style['social-btn']" @click="handleLogin()"><span :class="$style['social-logo-wrapper']">
                    <img :class="$style['social-logo']" :src="social.socialLogoSrc" :alt="social.socialLogoAlt">
                </span>
                <span :class="$style['social-text']">{{ social.socialText }}</span>
            </button>
        </template>
        <button v-else-if="loginStatus === 'login'" style="cursor: pointer;" @click="handleLogout()">Log out</button>
        <button v-else-if="loginStatus === 'pending'">Loading data...</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Majiang from "@/components/majiang/majiang"
import $ from 'jquery';
import { authState, login, logout, check } from "@/state/authState"

const { hide, show, fadeIn, scale,
    setSelector, clearSelector } = Majiang.UI.Util;
const lunbans = ['main', 'xiajia', 'duimian', 'shangjia']
const isLoading = ref(true)
const loadedRef = ref<any>()
const pageRef = ref<"paipu" | "netplay" | "index" | 'autoplay'>("index")
const loaderrElemRef = ref<HTMLDivElement | null>(null)
const loginStatus = ref<"pending" | "login" | "logout">("pending")
const socials=[
    {socialLogoSrc:"/src/assets/google-logo-NePEveMl.svg",socialLogoAlt:"Google logo",socialText:"Googleで続ける"},
    {socialLogoSrc:"/src/assets/microsoft-logo-BUXxQnXH.svg",socialLogoAlt:"Microsoft logo",socialText:"Microsoft アカウントで続ける"},
]

onMounted(() => {
    isLoading.value = false
    init()
    loaderr()
    loginStatus.value = "pending"
    check().then((resolve) => {
        if (resolve) {
            loginStatus.value = "login"
        } else {
            loginStatus.value = "logout"
        }
    })

})

async function handleLogin() {
    await login()
}
async function handleLogout() {
    await logout()
}


function loaderr() {
    if (typeof Majiang === 'undefined' && loaderrElemRef.value) loaderrElemRef.value.removeAttribute('style');
}

function init() {
    let game;
    const pai = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));
    const analyzer = (kaiju: any) => {
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
            () => $('body').removeClass('analyzer'));
    };
    const viewer = (paipu: any) => {
        $('#board .controller').addClass('paipu')
        $('body').attr('class', 'board');
        scale($('#board'), $('#space'));
        return new Majiang.UI.Paipu(
            $('#board'), paipu, pai, audio, 'Majiang.pref',
            () => fadeIn($('body').attr('class', 'file')),
            analyzer);
    };
    const stat = (paipu_list: any) => {
        fadeIn($('body').attr('class', 'stat'));
        return new Majiang.UI.PaipuStat($('#stat'), paipu_list,
            () => fadeIn($('body').attr('class', 'file')));
    };
    const file = new Majiang.UI.PaipuFile($('#file'), 'Majiang.game',
        viewer, stat, null, null, null);
    const rule = Majiang.rule(
        JSON.parse(localStorage.getItem('Majiang.rule') || '{}'));
    function start() {
        let players = [new Majiang.UI.Player($('#board'), pai, audio)];
        for (let i = 1; i < 4; i++) {
            players[i] = new Majiang.AI();
        }
        game = new Majiang.Game(players, end, rule);
        game.view = new Majiang.UI.Board($('#board .board'),
            pai, audio, game.model);

        $('#board .controller').removeClass('paipu')
        $('body').attr('class', 'board');
        scale($('#board'), $('#space'));

        new Majiang.UI.GameCtl($('#board'), 'Majiang.pref', game, game._view);
        game.kaiju();
    }

    function end(paipu: any) {
        if (paipu) file.add(paipu, 10);
        fadeIn($('body').attr('class', 'file'));
        file.redraw();
    }

    $('#file .start').on('click', start);

    $(window).on('resize', () => scale($('#board'), $('#space')));

    $(window).on('load', function () {
        hide($('#title .loading'));
        $('#title .start')
            .attr('tabindex', 0).attr('role', 'button')
            .on('click', () => {
                clearSelector('title');
                if (file.isEmpty) start();
                else end(null);
            });
        show(setSelector($('#title .start'), 'title',
            { focus: null, touch: false }));
    });
    if (loadedRef.value) $(window).trigger('load');
}

</script>
<style>
@import "/src/styles/index.styl";
</style>

<style module>
.social-btn {
    position: relative;
    width: 320px;
    border: 1px solid #c2c8d0;
    border-radius: 6px;
    font-size: 16px;
    align-items: center;
    background-color: #fff;
    height: 52px;
    transition: box-shadow .15 ease-in-out, background-color .15s ease-in-out;
    cursor: pointer;
    padding: 0 8px 0 52px;
    color: #2d333a;
    margin-bottom: 8px;
    display: flex;
    outline: 0;
}

.social-logo-wrapper {
    position: absolute;
    left: 26px;
    top: 50%;
    transform: translate(-50%) translateY(-50%);
}

.social-logo {
    width: 20px;
    height: 20px;
    display: inline-block;
}

.social-text {
    text-align: left;
    position: relative;
}
</style>