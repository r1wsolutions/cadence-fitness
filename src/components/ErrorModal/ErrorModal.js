
import classes from './ErrorModal.module.css'
import { useSelector, useDispatch } from 'react-redux'
import {errorActions} from '../../store/errorReducderSlice'

const ErrorModal =() =>{

    const hasError = useSelector((state)=>state.errorReducer.hasError)
    const message = useSelector((state)=>state.errorReducer.message)
    const dispatch = useDispatch()

    const closeErrorHanlder =() =>{
        dispatch(errorActions.clearError())
    }

    return (
        <>
        {hasError && 
            <div className={classes['error-wrapper']}>
                <h2 className={classes.title}>error</h2>
                <div className={classes['message-holder']}>
                    <p>{message}</p>
                </div>
                <button onClick={closeErrorHanlder} className={classes.btn}>close</button>
            </div>}
        </>
    )
}

export default ErrorModal