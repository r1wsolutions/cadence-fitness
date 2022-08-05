import { useEffect, useState } from "react"
import {useSelector, useDispatch} from "react-redux"
import { useParams,useHistory } from "react-router"
import {retrieveMonthlyExerciseCollection} from "../store/exerciseCollectionActions"
import {exerciseCollectionActions} from "../store/exerciseCollectionSlice"
import DayOfMonth from "../components/DayOfMonth/DayOfMonth"
import DayOfMonthSkeleton from "../components/DayOfMonth/DayOfMonthSkeleton"
import MonthlyStatDetail from '../components/MonthView/MonthlyStatDetail'
import classes from './MonthsView.module.css'

const initLoadingStatus = true

const MonthsView =() =>{

    const history = useHistory()
    const dispatch = useDispatch()    
    const params = useParams()

    //state-> nameOfReducer from store (index) -> variable needed
    const exerciseCollection = useSelector((state)=>state.exerciseCollectionReducer.exerciseCollection)
    const token = useSelector((state) => state.authReducer.authToken)
    const uid = useSelector((state)=> state.authReducer.uid)
    const didRetrieveExercises = useSelector((state) => state.exerciseCollectionReducer.didRetrieveExercises)
    const errorMessage = useSelector((state) => state.exerciseCollectionReducer.errorMessage)
    const [monthSelected, setMonthSelected] = useState([])
    const [totalExercisesPerformed, setTotalExercisesPerformed] = useState(0)
    const [totalSetsPerformed, setTotalSetsPerformed] = useState(0)
    const [totalRepsPerformed, setTotalRepsPerformed] = useState(0)
    const [isLoading, setIsLoading] = useState(initLoadingStatus)
    const namesOfTheDays = [ 'sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat' ]

    useEffect(()=>{

        //setup days of the month
        let month = parseInt(params.month)
        let year = parseInt(params.year)
        const datesOfTheMonth = []
        const rollingDays = []

        //starts on the first day of the month then increments during loop until month is out
        let date = new Date(year, month)
       
        const totalDays = new Date(year, month + 1, 0).getDate()
        const totalDisplayDays = 42
        //based on the date the user selected get all days of the month
        //while(date.getMonth() === month)
        for(let i = 0; i < totalDays;i++){
            //push first day of the month
            //console.log(date.toLocaleDateString({ weekday: 'long' }))

            datesOfTheMonth.push({
                month: date.getMonth() + 1,//months with Date object start at 0 unless inputing to get date
                day: date.getDate(),
                year: date.getFullYear(),
                dayIndex: date.getDay()
            })
            //increment to next day
            date.setDate(date.getDate() + 1)
            //eventually month will end
        }

        let dayOneIndex = datesOfTheMonth.findIndex((d)=> d.day === 1)//the first day of the month
        //the day of the week the first day falls on less one, this is the new index position to place it
        const newDayOneIndex = datesOfTheMonth[dayOneIndex].dayIndex - 1 

        for(let i = 0; i < totalDisplayDays ; i++)
        {
            if(i <= newDayOneIndex)
            {
                rollingDays.push({
                    date: 'EMPTY'
                })
            }
            
            if(i > newDayOneIndex)
            {
                let oldIndex = dayOneIndex++

                if(datesOfTheMonth[oldIndex])//if we are still in the current month
                {
                    rollingDays.push(datesOfTheMonth[oldIndex])
                }else{
                    rollingDays.push({
                        date: 'EMPTY'
                    })  
                }
                
            }
        }

        setMonthSelected(rollingDays)
        
        if(didRetrieveExercises != null)
        {
            setIsLoading(false)
            let differentExercises = []
            let setCount = 0
            let repCount = 0

            exerciseCollection.forEach((day)=>{
                
                for(let i in day.exercises)
                {
                    let foundEx = differentExercises.findIndex((ex) => ex.name === i)

                    //different exercises performed
                    if(foundEx < 0)
                    {
                        differentExercises.push({
                            name: i
                        })
                    }

                    //total reps performed
                    for(let j in day.exercises[i])
                    {
                        setCount++
                        repCount = repCount + parseInt(day.exercises[i][j].amount)
                    }
                }

                setTotalExercisesPerformed(differentExercises.length)
                setTotalSetsPerformed(setCount)
                setTotalRepsPerformed(repCount)
            })
            
        }

        if(isLoading)
        {
            dispatch(retrieveMonthlyExerciseCollection(year, month, uid, token))
        } 

    },[dispatch, params, uid, didRetrieveExercises, exerciseCollection, isLoading, history, token])

    const dateSelectedHandler = () => {
        
        dispatch(exerciseCollectionActions.setDidSetDay({status: false}))
        dispatch(exerciseCollectionActions.clearDailyWorkout())
    }

    return (
        <div className={classes.wrapper}>
            {isLoading && <h1>IS LOADING...</h1>}
            {!didRetrieveExercises && <h2>{errorMessage}</h2>}
            {!isLoading && didRetrieveExercises &&<>
            <div className={classes.details}>
                <MonthlyStatDetail 
                    count={exerciseCollection.length}
                    title='days workedout'
                />
                <hr className={classes['divider-vertical']}></hr>    
                <MonthlyStatDetail 
                    count={totalExercisesPerformed}
                    title='exercises performed'
                />
                <hr className={classes['divider-vertical']}></hr>
                <MonthlyStatDetail 
                    count={totalSetsPerformed}
                    title='sets completed'
                />
                <hr className={classes['divider-vertical']}></hr>
                <MonthlyStatDetail 
                    count={totalRepsPerformed}
                    title='reps completed'
                />
            </div>
            <hr className={classes['divider-horizontal']}></hr>
            <div className={classes['day-names']}>
                {namesOfTheDays.map((n,i)=><p key={i} className={classes['day-name']}>{n}</p>)}
            </div>
            <div className={classes.month}>
            {monthSelected.map((m, i)=> {

                    let didWorkOut = false
                    let workoutIndex = null
                    let curDate = new Date(`${m.month}-${m.day}-${m.year}`)
                    
                    exerciseCollection.forEach((element,i) => {
                        let workoutDate = new Date(element.date)
            
                        if(workoutDate.getTime() === curDate.getTime())
                        {
                            didWorkOut = true
                            workoutIndex = i
                        }
                    });
                    
                    if(didWorkOut)
                        {
                            return <DayOfMonth
                                        onClick={dateSelectedHandler}
                                        key={`${m.month}_${m.day}`} 
                                        month={m.month} 
                                        day={m.day} 
                                        year={m.year}
                                        workedout='Worked Out!'
                                        id={workoutIndex}
                                    />
                        }

                    return <DayOfMonthSkeleton
                                key={i} 
                                month={m.month} 
                                day={m.day} 
                                year={m.year}
                                workedout=''
                                isEmpty={m.date === 'EMPTY'}
                            />
                })}
            </div>
            </>}
        </div>
    )
}

export default MonthsView