import imp1

#変換システム from: 某AI

# キーで検索して最初の index を返す
def search_key(list_name, key_input):
    return next((i for i, obj in enumerate(list_name) if key_input in obj), -1)

# 値で検索して最初の index を返す
def search_value(list_name, value_input):
    return next((i for i, obj in enumerate(list_name) if value_input in obj.values()), -1)

def split_2(text):
    """
    入力文字列 text を「見た目で1文字単位」に分解してリストで返す
    半角カナ + 濁点／半濁点も1文字扱い
    """
    # 半角カナ＋濁点／半濁点の結合表（全対応）
    half_kana_base = [
        "ｶ","ｷ","ｸ","ｹ","ｺ",
        "ｻ","ｼ","ｽ","ｾ","ｿ",
        "ﾀ","ﾁ","ﾂ","ﾃ","ﾄ",
        "ﾊ","ﾋ","ﾌ","ﾍ","ﾎ",
        "ｳ","ﾜ","ｦ","ﾝ","ｱ","ｲ","ｴ","ｵ","ｴ","ｦ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾔ","ﾕ","ﾖ"
    ]

    combine = {}
    # 濁点付き
    for c in half_kana_base:
        combine[c + "ﾞ"] = c + "ﾞ"
    # 半濁点付き（ハ行のみ）
    for c in ["ﾊ","ﾋ","ﾌ","ﾍ","ﾎ"]:
        combine[c + "ﾟ"] = c + "ﾟ"

    result = []
    i = 0
    while i < len(text):
        if i + 1 < len(text) and text[i+1] in ["ﾞ", "ﾟ"]:
            pair = text[i] + text[i+1]
            if pair in combine:
                result.append(combine[pair])
                i += 2
                continue
        result.append(text[i])
        i += 1

    return result
