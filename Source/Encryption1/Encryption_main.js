/**
 * 多層XORストリーム暗号エンジン (10分クオリティ・完全版)
 * @param {Uint8Array} data - 暗号化/復号したいバイナリデータ
 * @param {number} keycount - 自動生成時の鍵の数
 * @param {number} keybytes - 自動生成時の1鍵あたりの長さ
 * @param {string|Array|Uint8Array} key - 鍵 (Base64文字列、リスト、または合体鍵)
 * @param {string} system - 再帰制御フラグ ("\1"でバイナリモード)
 */
function xorRdUint8(data, keycount = 8, keybytes = 1, key = "\0", system = "\0") {
    if (key !== "\0") {
        // 1. データのコピーを作成（元のUint8Arrayを破壊しない）
        let dt = new Uint8Array(data);
        let rawKey;

        // 2. 入力鍵の自動解析（合体鍵 "base64_base64" をバラす）
        if (typeof key === "string" && key.includes("_")) {
            rawKey = key.split("_");
        } else {
            // 単体ならリスト [key] に包む
            rawKey = (Array.isArray(key) && !(key instanceof Uint8Array)) ? key : [key];
        }

        // 3. 全ての鍵を生のバイト配列（数値の配列）に正規化
        let keyBytes = (system !== "\1") 
            ? rawKey.map(x => {
                if (typeof x === "string") {
                    try {
                        // Base64としてデコード。失敗したら通常の文字列エンコード
                        return Array.from(Uint8Array.fromBase64(x));
                    } catch(e) {
                        return Array.from(new TextEncoder().encode(x));
                    }
                }
                if (x instanceof Uint8Array || Array.isArray(x)) return Array.from(x);
                return [Number(x)];
            }) 
            : rawKey;

        // 4. 多層ストリーム暗号演算 (1重ループ・ずらし方式)
        // データの位置 i に応じて、各鍵の参照位置をずらしてXOR
        for (let i = 0; i < dt.length; i++) {
            for (let k = 0; k < keyBytes.length; k++) {
                dt[i] ^= keyBytes[k][i % keyBytes[k].length];
            }
        }

        // 5. 各鍵をBase64化したリストを作成
        const k64List = keyBytes.map(kb => new Uint8Array(kb).toBase64());

        // 6. 全情報を網羅した戻り値
        return {
            result: dt,                      // 処理後のUint8Array
            resultBase64: dt.toBase64(),      // 処理後のBase64 (砂嵐/復元画像)
            key: keyBytes,                   // 鍵の生データ
            keyBase64: k64List,              // 鍵ごとのBase64リスト
            keyAllBase64: k64List.join("_")  // これ1本で復号可能な合体鍵
        };
    } else {
        // 7. 鍵の自動生成（keycount個、各keybytes長）
        let key_ = [];
        for (let i = 0; i < keycount; i++) {
            key_.push(Array.from(crypto.getRandomValues(new Uint8Array(keybytes))));
        }
        // 生成した生の鍵リストを渡して再帰実行
        return xorRdUint8(data, keycount, keybytes, key_, "\1");
    }
}
