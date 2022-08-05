import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AddWorkoutModal from '../components/AddWorkout/AddWorkoutModal'
import {customWoListReducerSliceActions} from '../store/customWoListReducerSlice'

import classes from './LogWorkout.module.css'


const LogWorkout =() =>{ 

    const dispatch = useDispatch()
    const uid = useSelector((state) => state.authReducer.uid)
    const token = useSelector((state) => state.authReducer.authToken)
    const listUpdated = useSelector((state) => state.customWoListReducer.listUpdated)
    const [closeAddWoModal, setCloseAddWoModal] = useState(true)
    const [isLoading, setIsLoading] = useState(false)   

    const customExercises = useSelector((state) => state.customWoListReducer.customWorkouts)

    const customExerciseselection = customExercises.length > 0 && <select className={classes.inp} name='exercise'>
                                        {customExercises.map((e,i)=><option key={i} value={e.name}>{e.name}</option>)}
                                    </select>
    
    /*
        <select className={classes.inp} name='exercise'>
                                {customExercises.map((e,i)=><option key={i} value={e.name}>{e.name}</option>)}
                        </select>
    */

    const closeModalHandler = () =>{
        setCloseAddWoModal((state)=> !state)
    }

    useEffect(()=>{

        const getPersonalWo = async () => {
            const personalWoReq = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/personalWoCollection/.json?auth=${token}`)
    
            const personalWoRes = await personalWoReq.json()

            if(personalWoRes === null) return

            for(const wo in personalWoRes)
            {
                dispatch(customWoListReducerSliceActions.addWorkoutName({
                    name: personalWoRes[wo].name
                }))
            }

            dispatch(customWoListReducerSliceActions.setListUpdated({listUpdated: true}))
        }

        if(uid && !listUpdated)getPersonalWo()
    },[token, uid, dispatch, listUpdated])

    const logExerciseHander = async (e) =>{
        
        e.preventDefault()
        const logForm = document.getElementById('log-form')

        try {
            
            const exercise = e.target.exercise.value
            const qty = e.target.qty.value

            if(exercise.length < 1 || qty.length < 1)
            {
                throw new Error('Please enter a valid amount!')
            }

            if(parseInt(qty) < 1)
            {
                throw new Error('Cannot enter a set less than 1!')
            }

            const date = withoutTime(new Date(Date.now()))

            const workout = {
                exercise: exercise,
                amount: qty,
                timestampe: new Date(Date.now())
            }

            setIsLoading(true)

            const postRequest = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${date.getFullYear()}/${date.getMonth()}/${date}/${exercise}/.json?auth=${token}`,{
                method: "POST",
                body: JSON.stringify(workout)
            })

            if(postRequest.ok)
            {
                logForm.reset()
                setIsLoading(false)
                alert('SUCCESS, your numbers are looking good!')
                return
            }
            
            //const postResponse = await postRequest.json()
            
            throw new Error('Could not save your workout to the server')

        } catch (error) {
            setIsLoading(false)
            alert(error.message)
        }
    }

    const withoutTime = (dateTime) => {
        var date = new Date(dateTime.getTime());
        date.setHours(0, 0, 0, 0);
        return date;
    }


    return (
    <div className={classes['home-wrapper']}>
        {!closeAddWoModal && <AddWorkoutModal 
            token={token}
            uid={uid}
            woCollection={customExercises}
            closeHandler={closeModalHandler}
        />}
        <h1 className={classes.title}>track your progress</h1>
        <form onSubmit={logExerciseHander} id='log-form' className={classes['log-form']}>
            <div className={classes['input-holder']}>
                <label>{`${customExercises.length > 0 ? 'select an exercise':'press below to create a custom list'}`}</label>
                {customExerciseselection}   
            </div>
            

            <div className={classes['input-holder']}>
                <label>QTY</label>
                <input id={classes.qty} className={classes.inp} name='qty' type='number' placeholder='reps completed' />
            </div>

            {!isLoading ? <button className={classes['save-btn']}>SAVE</button> : <p>loading...</p>}
        </form>
        {<button 
            className={classes['save-btn']} 
            onClick={closeModalHandler}
        >
                { customExercises.length > 0 ? 'add a new exercise' :'create personal list'}
        </button>}
    </div>)
}


export default LogWorkout 