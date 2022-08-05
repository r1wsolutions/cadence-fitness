import { useDispatch,useSelector } from 'react-redux'
import {errorActions} from '../../store/errorReducderSlice'
import {customWoListReducerSliceActions} from '../../store/customWoListReducerSlice'
import classes from './AddWorkoutModal.module.css'

const AddWorkoutModal = (props) => { 

    const dispatch = useDispatch()
    const customExercises = useSelector((state) => state.customWoListReducer.customWorkouts)

    const submitWoNameHandler = async (e) =>{

        e.preventDefault()

        const name = e.target.name.value
        let duplicate = false

        if(name.length < 1)
        {
            dispatch(errorActions.setError({
                message: 'please enter a workout name'
            }))

            return
        }

        customExercises.forEach(element => {
            if(element.name === name) 
            {
                dispatch(errorActions.setError({
                    message: 'please enter a new exercise'
                }))
                
                duplicate = true
                return
            }
        });

        if(duplicate) return

        const postPersonalWo = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${props.uid}/personalWoCollection/.json?auth=${props.token}`,{
            method: "POST",
            body: JSON.stringify({
                name: name
            })
        })

        if(postPersonalWo.ok)
        {
            dispatch(customWoListReducerSliceActions.addWorkoutName({name: name}))
            props.closeHandler()
        }
    
    }

    return(
        <>
            <form className={classes.form} onSubmit={submitWoNameHandler}>
                <div 
                    className={classes.close}
                    onClick={()=>{
                        props.closeHandler()    
                    }}
                >
                    x
                </div>
                <input className={classes.inp} name='name' placeholder='enter exercise name' />
                <button className={classes.btn}>submit</button>
            </form>
            <div 
                className={classes.backdrop}
                onClick={()=>{
                    props.closeHandler()
                }}
            >
                
            </div>
        </>
    )
}

export default AddWorkoutModal