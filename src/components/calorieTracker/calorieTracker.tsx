import React, {useEffect, useState} from 'react'
import classes from './calorieTracker.module.scss'
import SearchIcon from '@material-ui/icons/Search';
import {Input} from "antd";
import axios from "axios";
import {ClickAwayListener, MenuItem, MenuList, Paper} from "@material-ui/core";
import FoodItem from "./item/foodItem";
import {useSelector} from "react-redux";
import {state} from "../../index";
import FoodItemRemove from "./item/foodItemRemove";

interface props{

}

const CalorieTracker:React.FC<props>=(props)=>{
    const [autoComplete,setAutoComplete]=useState([])
    const [input,setInput]=useState('')
    const [menu,setMenu]=useState(false)
    const [item,setItem]=useState<any[]>([])
    const [calorie,setCalorie]=useState(0)
    const [hints,setHints]=useState<any[]>([])
    const [sticky,setSticky]=useState<any[]>([])
    const [responseCalorie,setResponseCalorie]=useState<any>(0)
    const [targetCalorie,setTargetCalorie]=useState<any>(1000)

    const quantity=useSelector((state:state)=>{
        return state.calorieTracker.quantity
    })

    useEffect(()=>{
        input&&axios.get(`https://api.edamam.com/auto-complete?app_id=af4c77be&app_key=9f09845aba8b748e805acf3c6178a151&q=${input}&limit=6`).then((response)=>{
            setAutoComplete(response.data)
        })
    },[input])

    useEffect(() => {
        input&&axios.get(`https://api.edamam.com/api/menu-items/v2/search?app_id=af4c77be&app_key=9f09845aba8b748e805acf3c6178a151&q=${input}`).then((response)=>{
            let result=[]
            for(let key in response.data.hints){
                result.push(response.data.hints[key].food.label)
            }
            const uniqueResult=Array.from(new Set(result))
            setItem(uniqueResult)
        })

    }, [input]);
    //console.log(item)

    useEffect(()=>{
        input&&axios.get(`https://api.edamam.com/api/food-database/v2/parser?app_id=af4c77be&app_key=9f09845aba8b748e805acf3c6178a151&ingr=${input}`).then((response)=>{
            setHints(response.data.hints)
        })
    },[input])

    const width=((calorie/targetCalorie)*28.5)+'rem'
    calorie<0&&setCalorie(0)

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
                           <div style={{position: 'absolute',zIndex:1}}>
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
                           <div style={{textAlign:'center'}}>today's calorie target</div>
                           <input style={{
                               textAlign:'center',
                               marginTop:'0.3rem',
                               fontWeight:'bold',
                               border:'none',
                               backgroundColor:'transparent',
                               fontSize:'1.7rem'
                           }}
                                  value={targetCalorie}
                                  onChange={(e)=>{
                                      setTargetCalorie(e.target.value);
                                      calorie<0&&setCalorie(0)
                                  }}
                           />
                       </div>
                   </div>
               </div>
               <div className={classes.container_body}>
                   <div className={classes.items}>
                       {sticky.map((item,index)=>{
                           const remove=()=>{
                               const stickyCopy=sticky
                               stickyCopy.splice(index,1)
                               setSticky([...stickyCopy])

                               setCalorie((prev)=>{
                                   return prev-responseCalorie
                               })

                               calorie<0&&setCalorie(0)
                               sticky.length===0&&setCalorie(0)
                               console.log(sticky)
                           }

                           return (
                               <FoodItemRemove name={item.name}
                                               key={item.name}
                                               style={{backgroundColor:'orange'}}
                                               quantity={item.number}
                                               remove={remove}
                               />
                           )
                       })}
                       {item?.map((items,index)=>{
                           const param={
                               "ingredients": [
                                   {
                                       "quantity": parseInt(quantity),
                                       "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
                                       "foodId": hints[index]?.food.foodId
                                   }
                               ]
                           }
                           const add=()=>{
                               console.log(quantity)
                               axios.post('https://api.edamam.com/api/food-database/v2/nutrients?app_id=af4c77be&app_key=9f09845aba8b748e805acf3c6178a151',param).then((response)=>{
                                   //console.log(response.data)
                                   //console.log(hints[index]?.food.foodId)
                                   setCalorie((prev)=>{
                                       return prev + response.data.calories
                                   })
                                   setResponseCalorie(response.data.calories)
                               })

                               let itemCopy=item
                               const [removedItem]=itemCopy.splice(index,1)
                               setItem(itemCopy)

                               const stickyCopy=sticky
                               stickyCopy.push({name:removedItem,number:quantity})
                               setSticky([...stickyCopy])
                               console.log(sticky)
                               console.log(responseCalorie)
                           }
                           return <FoodItem name={items} key={items} add={add}/>
                       })}
                   </div>
                   <div className={classes.summary}>
                       <div>
                           Your Daily calorie summary
                       </div>
                       <div style={{marginTop:'6rem',fontWeight:'bold'}}>
                           {calorie} cal
                       </div>
                       <div className={classes.progress}>
                           <div style={{
                               height:'5rem',
                               borderRadius:'1rem',
                               backgroundColor:'#4098ff',
                               width:width
                           }}>

                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </>
   )
}

export default CalorieTracker