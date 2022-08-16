
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { weeklyStats, monthlyStats, annualStats, customStats} from '../helpers/statsSorting'
import { errorActions } from '../store/errorReducderSlice'
//import Graph from '../components/Chart/Graphs/Graph'
import ApexGraph from '../components/Chart/Graphs/ApexGraph'

import classes from './Stats.module.css'
  

const Stats =() =>{

    const dispatch = useDispatch()
    const token = useSelector((state) => state.authReducer.authToken)
    const uid = useSelector((state) => state.authReducer.uid)
    const screenInnerWidth = useSelector((state)=>state.dimensionsReducer.screenInnerWidth)
    const [clickedSelector, setClickedSelector] = useState(false)
    const [optionSelected, setSetOptionSelected] = useState('')
    const [monthSnapshot, setMonthSnapshot] = useState([])
    const [yearSnapshot, setYearSnapshot] = useState({})
    const [annualSnapshot, setAnnualSnapshot] = useState({})
    const [customSnapshot, setCustomSnapshot] = useState({})
    const [exercisesCompleted, setExercisesCompleted] = useState([])
    const options = ['weekly','monthly','annually', 'custom']

    const years = [
        '2022',
        '2021',
        '2020',
        '2019'
    ]

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul",
            "Aug","Sep","Oct","Nov","Dec"];

 
    const onClickSelectorHanlder = () =>{
        setClickedSelector((prevState) => !prevState)
    }

    const backgroundClickHandler  = () =>{
        
        setClickedSelector(false)
    }

    const setIntervalHanlder = (interval) =>{
        setSetOptionSelected(interval)
    }

    const getStatsHandler = async (e) =>{
        
        e.preventDefault()

        setExercisesCompleted([])
        setMonthSnapshot([])

        if(optionSelected === 'weekly')
        {
            const thisMonthCollection = []
            const thisMonth = await weeklyStats(e,months,token,uid)
            
            
            if(thisMonth.error)
            {

                dispatch(errorActions.setError({
                    message: thisMonth.error.message
                }))
                return
            }
            
            if(thisMonth)
            {
                for(let i in thisMonth)
                {
                    thisMonthCollection.push({
                        week: i,
                        weeklyData:thisMonth[i]
                    })
                }
                const exercisesCollection = []

                for(let i = 0; i < thisMonthCollection.length; i++)
                {
                    for(let j = 0; j < thisMonthCollection[i].weeklyData.length; j++)
                    {
                        let exIndex = exercisesCollection.findIndex((exC) => exC === thisMonthCollection[i].weeklyData[j].name)

                        if(exIndex < 0)
                        {
                            exercisesCollection.push(thisMonthCollection[i].weeklyData[j].name)
                        }
                    }
                }

                setExercisesCompleted(exercisesCollection)//this should be all the exercises worked out during any given week

                setMonthSnapshot(thisMonthCollection)
            }
        }

        if(optionSelected === 'monthly')
        {
            const yearSelected = e.target.year.value
            const monthlyResults = await monthlyStats(yearSelected, token, uid)

            if(monthlyResults.error)
            {
                dispatch(errorActions.setError({
                    message: monthlyResults.error.message
                }))
                
                return
            }

            if(monthlyResults)
            {
                setYearSnapshot(monthlyResults)
            }
        }

        if(optionSelected === 'annually')
        {
            const annualStatsResponse = await annualStats(uid,token)

            if(annualStatsResponse.error)
            {
                dispatch(errorActions.setError({
                    message: annualStatsResponse.error.message
                }))
                return
            }

            if(annualStatsResponse)
            {
                setAnnualSnapshot(annualStatsResponse)
            }
        }
        
        if(optionSelected === 'custom')
        {
            let fromDate = e.target.from.value
            let toDate = e.target.to.value

            if(fromDate === '' || toDate === '')
            {
                dispatch(errorActions.setError({message: 'please select a "from" and "to" date!'}))
                return
            }

            //raw format is yyyy/mm/dd
            const convertedFromDate = {
                month:fromDate.slice(5,7),
                day:fromDate.slice(8,10),
                year:fromDate.slice(0,4)
            }

            const convertedToDate = {
                month:toDate.slice(5,7),
                day:toDate.slice(8,10),
                year:toDate.slice(0,4)
            }

            fromDate = new Date(`${convertedFromDate.month}-${convertedFromDate.day}-${convertedFromDate.year}`)
            toDate = new Date(`${convertedToDate.month}-${convertedToDate.day}-${convertedToDate.year}`)
            const todaysDate = Date.now()
            
            if(fromDate > toDate)
            {
                dispatch(errorActions.setError({message: 'please select a "from" date before the "to" date!'}))
                return
            }

            if(toDate > todaysDate || fromDate > todaysDate)
            {
                dispatch(errorActions.setError({message: 'dates cannot be a future date!'}))
                return
            }

            const customRequest = await customStats({
                    from: fromDate, 
                    to: toDate
                },
                uid, 
                token)
        
            setCustomSnapshot(customRequest)
        }
    }

    const monthlySelection = <div>
                            <h2 className={classes['option-selected']}>{optionSelected}</h2>
                            <div>
                                <select className={classes.dropdown} name='year'>
                                    {years.map((y)=><option className={classes.option} key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
    
    const weeklySelection = <div>
                                <h2 className={classes['option-selected']}>{optionSelected}</h2>
                                <div>
                                    <select className={classes.dropdown} name='year'>
                                        {years.map((y)=><option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <select className={classes.dropdown} name='month'>
                                        {months.map((m)=><option key={m} value={m} >{m}</option>)}
                                    </select>
                                </div>
                            </div>

    const annuallySelected = <div>
                                <h2 className={classes['option-selected']}>{optionSelected}</h2>
                            </div>

    const customSelected = <div className={classes['custom-range']}>
                                <h2>from</h2>
                                <input name='from' className={classes['custom-inp']} type='date'/>

                                <h2>to</h2>
                                <input name='to' className={classes['custom-inp']} type='date'/>
                            </div>
    const weeklyResults = exercisesCompleted.map((ex, exIndex) => {

        let rawCollection = []
        
        monthSnapshot && monthSnapshot.forEach((week, snapIndex) => {
        
            let objToPush = {
                title: `${week.week.slice(0,4)} - ${snapIndex+1}`
            }

            rawCollection.push(objToPush)
            
            week.weeklyData.forEach((wd)=> {
        
                if(wd.name === ex)
                {
                    rawCollection[snapIndex].reps = wd.total
                }
            })
        })

        
        return <ApexGraph 
                    key={exIndex}
                    title={ex} 
                    rawCollection={rawCollection}
                    windowWidth={screenInnerWidth}
                />
        
        /*
            return <Graph
                        key={exIndex}
                        title={ex} 
                        rawCollection={rawCollection}
                        isLong={optionSelected === 'monthly'}
                        changeBackground={parseInt(exIndex) % 2 !== 0}
                        changeStart={true}
                    />
                */
        })

    return (
        <div  
            className={classes.wrapper}
            onClick={()=>{if(clickedSelector) backgroundClickHandler()}}
        >
            <div 
                className={classes['options-holder']} 
                onClick={onClickSelectorHanlder}
            >
                <p className={classes.interval}>INTERVAL SELECTION</p>
                {clickedSelector &&
                   <div className={classes.options}>
                       {options.map((o,i)=><div onClick={()=>{setIntervalHanlder(o)}} className={`${classes.option} ${i === 0 && classes.first} ${i === options.length - 1 && classes.last}`} 
                       key={i} value={o} >{o}</div>)}
                   </div>
                }
            </div>
            <form
                onSubmit={getStatsHandler} 
                className={classes.selected}
            >
                {optionSelected === 'weekly' &&  weeklySelection}
                {optionSelected === 'monthly' &&  monthlySelection}
                {optionSelected === 'annually' && annuallySelected}
                {optionSelected === 'custom' && customSelected}
                {optionSelected.length > 0 && <button className={classes.btn}>GO</button>}
            </form>
            
            <div className={classes['exercises-completed']}>
                {optionSelected === 'weekly' && exercisesCompleted && weeklyResults}
                
                {optionSelected === 'monthly' && yearSnapshot.exercisesCompleted && yearSnapshot.exercisesCompleted.length > 0 && 
                    yearSnapshot.exercisesCompleted.map((exCompleted, exCompI)=>{
                        
                        let graphCollection = []

                        yearSnapshot.exercisesRawData.forEach((exRaw)=>{
                            let exTotal = 0
                            
                            exRaw.exercisesCompleted.forEach((exForDay)=>{
                                
                                if(exForDay.exercise === exCompleted)
                                {
                                    exTotal+= parseInt(exForDay.reps)
                                }
                            })

                            graphCollection.push({ 
                                title: exRaw.title,
                                reps: exTotal
                            })
                        })
                        
                        return <ApexGraph 
                                    key={exCompI}
                                    title={exCompleted} 
                                    rawCollection={graphCollection}
                                    windowWidth={screenInnerWidth}
                                />
                        /*
                        return <Graph 
                            key={exCompI}
                            rawCollection={graphCollection}
                            title={exCompleted}
                            isLong={optionSelected === 'monthly'}
                            changeBackground={parseInt(exCompI) % 2 !== 0}
                            customSet={true}
                        />
                        */
                    })
                }

                {optionSelected === 'annually' && annualSnapshot.exercisesCompleted && annualSnapshot.exercisesCompleted.length > 0 && 
                    annualSnapshot.exercisesCompleted.map((exCompleted, exCompI)=>{
                        
                        let graphCollection = []



                        annualSnapshot.yearsWorkedOut.forEach((year)=>{

                            let exTotal = 0
                            
                            year.workouts.forEach((exForDay)=>{
                                
                                if(exForDay.exercise === exCompleted)
                                {
                                    exTotal+= parseInt(exForDay.reps)
                                }
                            })

                            graphCollection.push({
                                title: year.year,
                                reps: exTotal
                            })
                        })

                        return <ApexGraph 
                                    key={exCompI}
                                    title={exCompleted} 
                                    rawCollection={graphCollection}
                                    windowWidth={screenInnerWidth}
                                />
                        /*
                        return <Graph 
                            key={exCompI}
                            rawCollection={graphCollection}
                            title={exCompleted}
                            isLong={optionSelected === 'monthly'}
                            changeBackground={parseInt(exCompI) % 2 !== 0}
                        />
                        */
                    })
                }
                {
                    optionSelected === 'custom' && customSnapshot.workoutNames && 
                        customSnapshot.workoutNames.map((n,i)=> {

                            const graphCollection = []


                            customSnapshot.workouts.forEach((wo)=>{
                                if(wo.exercise === n)
                                {
                                    graphCollection.push(wo)
                                }
                            })

                            return <ApexGraph 
                                    key={i}
                                    title={n} 
                                    rawCollection={graphCollection}
                                    windowWidth={screenInnerWidth}
                                />

                            /*
                            return <Graph 
                                        key={i}
                                        rawCollection={graphCollection}
                                        title={n}
                                        isLong={false}
                                        changeBackground={parseInt(i) % 2 !== 0}
                                        customSet={graphCollection.length > 6}
                                    />
                            */
                    })
                }
            </div>
        </div>
    )
}

export default Stats