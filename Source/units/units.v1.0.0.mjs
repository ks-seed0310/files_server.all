class translate{
    version="2.9.16.144"
    allNode(){
        return Object.getOwnPropertyNames(Object.getPrototypeOf(this))
    }
    /**@param {string|Uint8Array} values */
    utf8ToUnicode(values){
        const r=this.utf8ToUnicodeDecimal(values)
        return r.map(x=>x.toString(16))
    }
    /**@param {string|Uint8Array} values */
    utf8ToUnicodeDecimal(values){
        let s
        if (values instanceof Uint8Array){
            s=new Uint8Array(values.buffer,values.byteOffset,values.byteLength)
        }else{
            s=new TextEncoder().encode(values)
        }
        let i=0
        const res=[]
        const check=(...va)=>va.some(v=>v===undefined||(v&192)!==128)
        const errMv=()=>{
            res.push(65533)
            i+=1
        }
        while (i<s.length){
            const b1=s[i]
            if ((b1&128)===0){
                res.push(b1)
                i+=1
            }else if ((b1&224)===192){
                const b2=s[i+1]
                if (check(b2)){errMv();continue}
                const cp=((b1&31)<<6)|(b2&63)
                res.push(cp)
                i+=2
            }else if ((b1&240)===224){
                const b2=s[i+1]
                const b3=s[i+2]
                if (check(b2,b3)){errMv();continue}
                const cp=((b1&15)<<12)|((b2&63)<<6)|(b3&63)
                if (cp>=55296&&cp<=57343){errMv();continue}
                res.push(cp)
                i+=3
            }else if ((b1&248)===240){
                const b2=s[i+1]
                const b3=s[i+2]
                const b4=s[i+3]
                if (check(b2,b3,b4)){errMv();continue}
                const cp=((b1&7)<<18)|((b2&63)<<12)|((b3&63)<<6)|(b4&63)
                if (cp>1114111){errMv();continue}
                res.push(cp)
                i+=4
            }else{
                errMv()
            }
        }
        return res
    }
    /**@param {Array<number>} values */
    unicodeDecimalToUtf8(values){
        const res=[]
        for (let i=0;i<values.length;i++){
            let cp=values[i]
            if (cp===undefined||(cp>=55296&&cp<=57343)||cp>1114111||cp<0){cp=65533}
            if (cp<=127){
                res.push(cp)
            }else if (cp<=2047){
                res.push((cp>>6)|192,(cp&63)|128)
            }else if (cp<=65535){
                res.push((cp>>12)|224,((cp>>6)&63)|128,(cp&63)|128)
            }else{
                res.push((cp>>18)|240,((cp>>12)&63)|128,((cp>>6)&63)|128,(cp&63)|128)
            }
        }
        return new Uint8Array(res)
    }
    /**@param {Array<string>|Uint16Array} values */
    unicodeToUtf8(values){
        if (values instanceof Uint16Array){
            return this.unicodeDecimalToUtf8(values)
        }else{
            return this.unicodeDecimalToUtf8(values.map(x=>parseInt(x,16)))
        }
    }
    /**@param {string|Uint8Array} values@param {0|1} resultType */
    //resultType[0:Array,1:String]
    utf8ToUtf16(values,resultType=0){
        const s=this.utf8ToUnicodeDecimal(values)
        const res=[]
        for (let i=0;i<s.length;i++){
            const cp=s[i]
            if (cp<=65535){
                res.push(cp)
            }else{
                const high=((cp-65536)>>10)|55296
                const low=((cp-65536)&1023)|56320
                res.push(high,low)
            }
        }
        if (resultType&1){
            return String.fromCharCode(...res)
        }else{
            return res
        }
    }
    /**@param {Array<string|number>|Uint16Array} values */
    //resultType[0:Uint8Array,1:String]
    utf16ToUtf8(values,radix=16,resultType=0){
        let s
        if (values instanceof Uint16Array){
            s=Array.from(values)
        }else{
            s=values.map(x=>parseInt(x,radix))
        }
        const ud=[]
        let i=0
        while (i<s.length){
            const w1=s[i]
            if (w1>=55296&&w1<=56319){
                const w2=s[i+1]
                if (w2>=56320&&w2<=57343){
                    const cp=(((w1&1023)<<10)|(w2&1023))+65536
                    ud.push(cp)
                    i+=2
                    continue
                }
                ud.push(65533)
                i+=1
            }else if (w1>=56320&&w1<=57343){
                ud.push(65533)
                i+=1
            }else{
                ud.push(w1)
                i+=1
            }
        }
        const RES=this.unicodeDecimalToUtf8(ud)
        if (resultType&1){
            return new TextDecoder("utf-8").decode(RES)
        }else{
            return RES
        } 
    }
}
export {translate}
export default translate