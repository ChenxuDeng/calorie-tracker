import React from 'react'
import classes from './item.module.scss'
import {Button} from "@material-ui/core";

interface props{
    name:string
}

const FoodItem:React.FC<props>=(props)=>{
    return (
        <>
            <div className={classes.container}>
                <div>
                    {props.name}
                </div>
                <select style={{border:'0.2rem solid black',borderRadius:'0.6rem'}}>
                    <option>
                        Qty
                    </option>
                    <option>
                        1
                    </option>
                    <option>
                        2
                    </option>
                    <option>
                        3
                    </option>
                    <option>
                        4
                    </option>
                    <option>
                        5
                    </option>
                    <option>
                        6
                    </option>
                </select>
                <Button variant={'outlined'} style={{border:'0.2rem solid black',borderRadius:'0.6rem'}}>
                    Add
                </Button>
            </div>
        </>
    )
}

export default FoodItem