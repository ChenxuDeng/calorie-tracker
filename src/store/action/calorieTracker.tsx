import {actionType} from "./actionType";

export const selectOption=(value:string)=>{
    return{
        type:actionType.SELECT_OPTION,
        value:value
    }
}