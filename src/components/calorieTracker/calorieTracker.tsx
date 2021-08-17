import React, {useEffect, useState} from 'react'
import classes from './calorieTracker.module.scss'
import SearchIcon from '@material-ui/icons/Search';
import {Input} from "antd";
import axios from "axios";
import {List, ListItem, MenuList, Paper, MenuItem, ClickAwayListener} from "@material-ui/core";
import FoodItem from "./item/foodItem";

interface props{

}

const CalorieTracker:React.FC<props>=(props)=>{
    const [autoComplete,setAutoComplete]=useState([])
    const [input,setInput]=useState('')
    const [menu,setMenu]=useState(false)
    const [item,setItem]=useState<any[]>([])

    useEffect(()=>{
        axios.get(`https://api.edamam.com/auto-complete?app_id=af4c77be&app_key=9f09845aba8b748e805acf3c6178a151&q=${input}&limit=6`).then((response)=>{
            setAutoComplete(response.data)
        })
    },[input])

    useEffect(() => {
        axios.get(`https://api.edamam.com/api/menu-items/v2/search?app_id=af4c77be&app_key=9f09845aba8b748e805acf3c6178a151&q=${input}`).then((response)=>{
            setItem(response.data.hints)
        })

    }, [input]);
    console.log(item)

   return (
       <>
           <div className={classes.container}>
               <div className={classes.container_header}>
                   <div>
                       <div className={classes.container_header_search}>
                           <SearchIcon className={classes.container_header_searchIcon}/>
                           <Input placeholder={'Search'}
                                  className={classes.container_header_input}
                                  value={input}
                                  onChange={(event)=>{setInput(event.target.value);setMenu(true)}}
                           />
                       </div>
                       {menu?<ClickAwayListener onClickAway={()=>{setMenu(false)}}>
                           <div style={{position: 'absolute'}}>
                               <Paper>
                                   <MenuList style={{padding: 0, width: '37rem'}}>
                                       {autoComplete.map((item) => {
                                           return (
                                               <MenuItem key={item} onClick={() => {
                                                   setInput(item);
                                                   setMenu(false)
                                               }}>
                                                   {item}
                                               </MenuItem>
                                           )
                                       })}
                                   </MenuList>
                               </Paper>
                           </div>
                       </ClickAwayListener>:null}
                   </div>

                   <div className={classes.container_header_targetCalorie}>
                       <div>
                           <div>today's calorie target</div>
                           <div style={{textAlign:'center',marginTop:'0.3rem'}}>1000</div>
                       </div>
                   </div>
               </div>
               <div className={classes.container_body}>
                   <div className={classes.items}>
                       {item.map((item,index)=>{
                           return <FoodItem name={item.food.label} key={index}/>
                       })}
                   </div>
                   <div className={classes.summary}>
                       <div>
                           Your Daily calorie summary
                       </div>
                       <div style={{marginTop:'6rem'}}>
                           300cal
                       </div>
                       <div style={{marginTop:'2rem'}}>
                           progress
                       </div>
                   </div>
               </div>
           </div>
       </>
   )
}

export default CalorieTracker