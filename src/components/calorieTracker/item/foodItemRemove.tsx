import React from 'react'
import classes from './item.module.scss'
import {Button} from "@material-ui/core";
import {useDispatch} from "react-redux";
import * as action from '../../../store/action/index'

interface props{
    name:string
    add?:()=>void
    style?:any
    quantity:number
    remove:()=>void
}

const FoodItemRemove:React.FC<props>=(props)=>{
    const dispatch=useDispatch()

    return (
        <>
            <div className={classes.container} style={props.style}>
                <div>
                    {props.name}
                </div>
                <select style={{border:'0.2rem solid black',borderRadius:'0.6rem'}}
                        onChange={(event)=>{dispatch(action.selectOption(event.target.value))}}
                        value={props.quantity}
                >
                    <option value={0}>
                        Qty
                    </option>
                    <option value={1}>
                        1
                    </option>
                    <option value={2}>
                        2
                    </option>
                    <option value={3}>
                        3
                    </option>
                </select>
                <Button variant={'outlined'}
                        style={{border: '0.2rem solid black', borderRadius: '0.6rem'}}
                        onClick={props.remove}
                >
                    Remove
                </Button>
            </div>
        </>
    )
}

export default FoodItemRemove