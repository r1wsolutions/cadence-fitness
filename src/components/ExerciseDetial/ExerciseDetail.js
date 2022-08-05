import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import classes from './ExerciseDetail.module.css'

const ExerciseDetial =(props) => {
    
    const exercise = props.exercise
    const dateId = props.dateId.toString()
    const exerciseCollection = useSelector((state) => state.exerciseCollectionReducer.exerciseCollection)
    const [allSets, setAllSets] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showReps, setShowReps] = useState(false)

    useEffect(()=>{

        const exerciseIndex = exerciseCollection.findIndex((day) => day.date.slice(0, 33) === dateId.slice(0, 33))

        if(exerciseIndex < 0)
        {
            console.log({
                m: 'did not find this date match',
                d: dateId
            })   
        }

        if(exerciseIndex > -1)
        {
            const tempExCollection = []

            for(let i in exerciseCollection[exerciseIndex].exercises)
            {
                if(i === exercise)
                {    
                    for(let j in exerciseCollection[exerciseIndex].exercises[i])
                    {
                        let hour = new Date(exerciseCollection[exerciseIndex].exercises[i][j].timestampe).getHours()
                        let minutes = new Date(exerciseCollection[exerciseIndex].exercises[i][j].timestampe).getMinutes()
                        let period = 'AM'
                        
                        if(hour >= 12)
                        {
                            period = 'PM'
                        }
                        
                        if(hour > 12)
                        {
                            hour = hour - 12
                        }

                        if(minutes < 10)
                        {
                            minutes = '0'+minutes
                        }

                        tempExCollection.push({
                            reps: exerciseCollection[exerciseIndex].exercises[i][j].amount,
                            timestamp: {
                                hour: hour,
                                minutes: minutes,
                                period: period
                            }
                        })
                    }
                }
            }

            setAllSets(tempExCollection)
            setIsLoading(false)
        }
    },[dateId, exerciseCollection, exercise])

    const showAllExercisesHandler = () => {
        setShowReps((prevState) => !prevState)
    }
    
    return (
        <>
        <div className={`${classes.exercise} ${showReps && classes.selected}`}>
            { !isLoading ?
            <>
                <h3>{props.exercise}</h3>
                <div className={classes.stat} ><p>reps:</p><h3>{props.reps}</h3></div>
                <div className={classes.stat} ><p>sets:</p><h3>{props.sets}</h3></div>
                <button className={classes.btn} onClick={showAllExercisesHandler}>{showReps ? 'hide' : 'view'}</button>
            </> : <p>loading...</p>
            }
        </div>
        {showReps && allSets.map((s,i)=> <div key={i} className={`${classes['set-detail']}  ${ i === 0 && classes.first} ${ (i + 1) === allSets.length && classes.last}` }>
                <div className={classes.stat} ><p>reps:</p><h3>{s.reps}</h3></div>
                <div className={classes.stat} ><p>time:</p><h3>{s.timestamp.hour} : {s.timestamp.minutes} {s.timestamp.period}</h3></div>
            </div>)}
        </>
    )
}

export default ExerciseDetial