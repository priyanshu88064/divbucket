import { useEffect, useState } from "react";

export function useDebounce(value,delay){
    const [dvalue,setDvalue] = useState(value)
    useEffect(()=>{
        const handler = setTimeout(() => {
            setDvalue(value);
        }, delay);
        return ()=>{
            clearTimeout(handler);
        }
    },[value,delay]);
    return dvalue;
}