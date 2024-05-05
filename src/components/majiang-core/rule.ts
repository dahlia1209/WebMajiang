export interface RuleConfig {
    '配給原点': number;
    '順位点': string[];
    '連風牌は2符': boolean;
    '赤牌': { m: number; p: number; s: number };
    'クイタンあり': boolean;
    '喰い替え許可レベル': number;
    '場数': number;
    '途中流局あり': boolean;
    '流し満貫あり': boolean;
    'ノーテン宣言あり': boolean;
    'ノーテン罰あり': boolean;
    '最大同時和了数': number;
    '連荘方式': number;
    'トビ終了あり': boolean;
    'オーラス止めあり': boolean;
    '延長戦方式': number;
    '一発あり': boolean;
    '裏ドラあり': boolean;
    'カンドラあり': boolean;
    'カン裏あり': boolean;
    'カンドラ後乗せ': boolean;
    'ツモ番なしリーチあり': boolean;
    'リーチ後暗槓許可レベル': number;
    '役満の複合あり': boolean;
    'ダブル役満あり': boolean;
    '数え役満あり': boolean;
    '役満パオあり': boolean;
    '切り上げ満貫あり': boolean;
}

const defaultRule: RuleConfig = {
    '配給原点': 25000,
    '順位点': ['20.0', '10.0', '-10.0', '-20.0'],
    '連風牌は2符': false,
    '赤牌': { m: 1, p: 1, s: 1 },
    'クイタンあり': true,
    '喰い替え許可レベル': 0,
    '場数': 2,
    '途中流局あり': true,
    '流し満貫あり': true,
    'ノーテン宣言あり': false,
    'ノーテン罰あり': true,
    '最大同時和了数': 2,
    '連荘方式': 2,
    'トビ終了あり': true,
    'オーラス止めあり': true,
    '延長戦方式': 1,
    '一発あり': true,
    '裏ドラあり': true,
    'カンドラあり': true,
    'カン裏あり': true,
    'カンドラ後乗せ': true,
    'ツモ番なしリーチあり': false,
    'リーチ後暗槓許可レベル': 2,
    '役満の複合あり': true,
    'ダブル役満あり': true,
    '数え役満あり': true,
    '役満パオあり': true,
    '切り上げ満貫あり': false
};

export function getRules(param: Partial<RuleConfig> = {}): RuleConfig {
    const rule = { ...defaultRule, ...param };
    return rule;
}
