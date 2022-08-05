import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router"
import {exerciseCollectionActions} from '../store/exerciseCollectionSlice'
import ExerciseDetial from "../components/ExerciseDetial/ExerciseDetail"

import classes from './DayDetails.module.css'


const DailyDetails =() => {
    
    const params = useParams()
    const histrory = useHistory()
    const dispatch = useDispatch()
    
    const workouts = useSelector((state) => state.exerciseCollectionReducer.exerciseCollection)
    const todaysWorkout = useSelector((state) => state.exerciseCollectionReducer.dailyWorkoutCollection)
    const didSetWorkouts = useSelector((state) => state.exerciseCollectionReducer.didSetDay)
    const index = parseInt(params.dayId)
    const daySnapshot = workouts[index]
    const dateInfo = workouts.length <= 0 ? new Date(Date.now()) : new Date(daySnapshot.date)
    
    useEffect(()=>{

        if(workouts.length <= 0)
        {
            histrory.goBack()
            return
        }

        if(didSetWorkouts) return

        if(!didSetWorkouts)
        {
            dispatch(exerciseCollectionActions.clearDailyWorkout())
        }

        for(let e in daySnapshot.exercises)
        {
            let doesContainExercise = todaysWorkout.findIndex((exercise)=> {
                
                if(exercise != null)
                {
                    return exercise.exercise !== e
                }

                return -1
            })
            
            if(doesContainExercise < 0)
            {
                let count = 0
                for(let ex in daySnapshot.exercises[e])
                {
                    
                    count++

                    if(count < 2) 
                    {
                        dispatch(exerciseCollectionActions.addToDailyWorkout({workout: daySnapshot.exercises[e][ex]}))
                    }else{
                        
                        const amountToAdd = parseInt(daySnapshot.exercises[e][ex].amount) 
                        dispatch(exerciseCollectionActions.updateToDailyWorkout({exercise: daySnapshot.exercises[e][ex].exercise, amountToAdd: amountToAdd}))
                    }
                    
                }   
            }
        }
        
        dispatch(exerciseCollectionActions.setDidSetDay({status: true}))
    }, [dispatch, daySnapshot, didSetWorkouts, todaysWorkout,histrory, workouts])

    return (
        <div className={classes.wrapper}>
            <h2> {dateInfo.getMonth() + 1} - {dateInfo.getDate()} - {dateInfo.getFullYear()}</h2>
            {todaysWorkout.length > 0 ? 
                <div className={classes['exercise-holder']} >
                    <hr className={classes.divider}></hr>
                    {todaysWorkout.map((e)=>{
                        
                        return <ExerciseDetial
                                    key={e.exercise}
                                    exercise={e.exercise}
                                    reps={e.amount}
                                    sets={e.sets}
                                    dateId={dateInfo}
                                />
                    })}
                </div> 
                : <p>loading...</p>}
        </div>
    )
}

export default DailyDetails