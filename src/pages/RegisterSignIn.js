import { useHistory } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { registerAction, signinAction } from '../store/authActions'
import { authReducerActions } from '../store/authReducerSlice'
import { errorActions } from '../store/errorReducderSlice'
import { useEffect, useState } from "react"
//password reset
import {adminCalls, initFireabaseApp} from '../firebase'


import classes from './RegisterSignIn.module.css'

const RegisterSignIn =() => {

    const history = useHistory()
    const isSignedIn = useSelector((state) => state.authReducer.isSignedIn)
    const dispatch = useDispatch()
    const [signingIn, setSigningIn] = useState(true)
    const [resetPassword, setResetPassword] = useState(false)
    const [resetPasswordComplete, setResetPasswordComplete] = useState(false)

    useEffect(()=>{

        dispatch(authReducerActions.checkAuthStatus())

        if(isSignedIn && localStorage.getItem('authExpireTiime'))
        {
            history.push('/log')
        }
    },[history, isSignedIn, dispatch])

    const demoButtonHanlder = () =>{
        signInRegistrationHandler({
            target: {
                email: {value: 'test01@test.com'},
                password: {value: '11111111'} 
            },
            preventDefault: ()=>{}
        })
    }

    const signInRegistrationHandler = async (e) =>{
        
        e.preventDefault()
        const authForm = document.getElementById('auth-form')

        const firstName = !signingIn ? e.target.firstName.value : ''
        const lastName = !signingIn ? e.target.lastName.value : ''
        const email = e.target.email.value
        const password = e.target.password.value
        const confirmedPassword = signingIn ? '' : e.target.confirmedPassword.value

        try {
            
            if((!signingIn && firstName.length < 1) || (!signingIn && lastName.length < 1))
            {
                throw new Error('enter a valid name')
            }


            if(!signingIn && password !== confirmedPassword)
            {
                throw new Error('passwords must match')
            }

            if(!email.includes('@'))
            {
                throw new Error('enter a valid email')
            }

            if(password.length < 8 || email.length < 4)
            {
                throw new Error('incorrect email or password')
            }

            if(signingIn)
            {
                dispatch(signinAction(email,password))
            }else{
                dispatch(registerAction({
                    email: email, 
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                }))
            }

        } catch (error) {
            dispatch(errorActions.setError({
                message: error.message
            }))
        }

        authForm.reset()
    }


    const switchHandler = () =>{
        setSigningIn((prevState) => !prevState)
    }

    const setResetPasswordBtn = () =>{
        setResetPassword((val)=> !val)
    }

    const resetPasswordHandler = async (e) =>{
        e.preventDefault()

        const email = e.target.email.value

        if(email.length < 1)
        {
            dispatch(errorActions.setError({message: 'please enter an email address'}))
        }

        if(!email.includes('@'))
        {
            dispatch(errorActions.setError({message: 'please enter a valid email address'}))
        }

        initFireabaseApp()
        adminCalls.resetPassword(adminCalls.auth(),email)
            .then(()=>{

                setResetPasswordComplete(true)  
                setResetPassword(false)

                return
            })
            .catch(()=>{
                dispatch(errorActions.setError({
                    message: 'email not found or email sent'
                }))

                return
            })
    }

    return (
        <>
        <div className={classes.wrapper}>
            {resetPasswordComplete &&
                <div
                    className={`${classes['pop-message']}`}
                >
                    <p>{'reset email sent'}</p>
                </div>
            }
            
            <h2>{signingIn ? 'sign in' : 'register' }</h2>
            {signingIn && 
                <button 
                    onClick={demoButtonHanlder}
                    className={`${classes['switch-btn']} ${classes['demo']}`}
                >
                    DEMO
                </button>
            }
            <form 
                id='auth-form' 
                className={classes['auth-form']} 
                onSubmit={resetPassword ? resetPasswordHandler : signInRegistrationHandler} 
                autoComplete='on'
            >
                {!signingIn && <>
                    <input className={classes.input} name='firstName' placeholder='first name' type='string' ></input>
                    <input className={classes.input} name='lastName' placeholder='last name' type='string' ></input>
                </>}
                <input className={classes.input} name='email' placeholder='email' type='string' ></input>
                {!resetPassword && <input className={classes.input} name='password' placeholder='password' type='password' autoComplete='off'></input>}
                {!signingIn && <input className={classes.input} name='confirmedPassword' placeholder='confirm password' type='password' autoComplete='off'></input>}
                <button className={classes['login-btn']}>SUBMIT</button>
            </form> 
            <button 
                className={classes['switch-btn']} 
                onClick={switchHandler}
            >
                {signingIn ? 'Need to register?' : 'Already registered?' }
            </button>
            {signingIn && 
                <button 
                    className={classes['switch-btn']}
                    onClick={setResetPasswordBtn}
                >
                        { resetPassword ? 'Sign in' : 'Forgot password?'}
                </button>
            }
        </div>
        <div
            className={classes['sub-title']}
        >
            <h2>{'track your evolution'}</h2>
        </div>
        </>
    )
}

export default RegisterSignIn