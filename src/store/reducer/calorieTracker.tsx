import {actionType} from "../action/actionType";

const initialState:any={
    quantity:0
}

interface selectOption {
    type:actionType.SELECT_OPTION,
    value:string
}

type action=selectOption

const calorieTracker=(state=initialState,action:action)=>{
    switch (action.type){
        case actionType.SELECT_OPTION:
            return{
                quantity: action.value
            }
        default:
            return state
    }
}

export default calorieTracker