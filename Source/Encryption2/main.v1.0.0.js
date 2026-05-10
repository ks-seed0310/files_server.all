class xorEncrypt{
    encrypt1(value,key=undefined,k2=undefined){
        let u32=new Uint32Array();
        let val_byte=0
        if (typeof value==="string"){
            let bf=new TextEncoder().encode(value)
            val_byte=bf.byteLength
            const buffer=new ArrayBuffer(Math.ceil(bf.byteLength/4)*4)
            new Uint8Array(buffer).set(bf)
            u32=new Uint32Array(buffer)
        }else if (typeof value==="number"||typeof value==="bigint"){
            return this.encrypt1(value.toString())
        }else if (value instanceof Uint32Array){
            val_byte=value.byteLength
            u32=value
        }else{
            throw new TypeError("Only number, string, bigint, and uint32array types can be specified as arguments.")
            return 1
        }
        let k=4294967295
        if (typeof key==="number"){
            k=new Uint32Array([key])[0]
        }else if (key instanceof Uint32Array){
            k=key[0]
        }else if (key===undefined){
            k=crypto.getRandomValues(new Uint32Array(1))[0]
        }else{
            throw new TypeError("Only number or uint32array or undefined types can be specified as arguments.")
        }
        let kp=0
        if (typeof k2==="number"){
            kp=new Uint32Array([k2])[0]
        }else if (k2 instanceof Uint32Array){
            kp=k2[0]
        }else if (k2===undefined){
            kp=0
        }else{
            throw new TypeError("Only number or uint32array or undefined types can be specified as arguments.")
        }
        let prev=k
        for (let i=0;i<u32.length;i++){
            let val=u32[i]^prev^kp
            u32[i]=(val<<5)|(val>>>(32-5))
            prev=u32[i]
        }
        const u32b=new Uint8Array(u32.buffer)
        const comb=new Uint8Array(u32b.length+1)
        comb[0]=4-val_byte%4
        comb.set(u32b,1)
        const ak_sub=((BigInt(kp)<<32n)+(BigInt(k)))
        return {
            result:u32,
            resBase64:u32b.toBase64(),
            respackBase64:comb.toBase64(),
            key:[k,kp],
            ak:ak_sub.toString(16).padStart(ak_sub>=4294967296?16:8,0)
        }
    }
    decrypt1(value,keys){
        let u32=new Uint32Array()
        let val_bt=0
        if (typeof value==="string"){
            const b=Uint8Array.fromBase64(value)
            if (b.byteLength%4!==0){
                val_bt=b[0]
                u32=new Uint32Array(b.subarray(1).slice().buffer)
            }else{
                u32=new Uint32Array(b.buffer)
            }
        }else if (value instanceof Uint32Array){
            u32=value
        }else{
            throw new TypeError("The `value` argument can only be of type `base64` or `Uint32Array`.")
        }
        let k=0
        let kp=0
        if (Array.isArray(keys)){
            if (Number.isInteger(keys[0])&&Number.isInteger(keys[1])){
                k=keys[0]
                kp=keys[1]
            }else{
                throw new TypeError("To specify an array as the `keys` argument, the contents of the array must be of type `number`.")
            }
        }else if (typeof keys==="string"){
            const kb=BigInt("0x"+keys)
            kp=Number(kb>>32n)
            k=Number(kb&0xffffffffn)
        }else{
            throw new TypeError("The `keys` argument can only accept arrays of numbers or hexadecimal strings.")
        }
        for (let i=u32.length-1;i>=0;i--){
            let val=u32[i]
            val=(val>>>5)|(val<<(32-5))
            let prev=(i===0)?k:u32[i-1]
            u32[i]=val^prev^kp
        }
        let u32b=new Uint8Array(u32.buffer)
        u32b=u32b.subarray(0,u32b.length-val_bt)
        return {
            result:u32,
            resBase64:u32b.toBase64(),
            decodedtext:new TextDecoder().decode(u32b),
            key:[k,kp],
            ak:((BigInt(kp)<<32n)+(BigInt(k))).toString(16)
        }
    }
}
