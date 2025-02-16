import { useState } from "react";

export default function useToggle(defaultValue:boolean = false){
    const [state,setState]= useState(defaultValue);
    const toggle=()=> {
        setState((prev:boolean)=>!prev);
    }
    return [state,toggle];
}