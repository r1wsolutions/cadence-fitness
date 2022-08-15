import {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {authReducerActions} from '../../store/authReducerSlice'
import {getProfileAction} from '../../store/authActions'
import {dimensionsActoins} from '../../store/dimensionsReducer'
import { useHistory } from 'react-router'
import NavBtn from '../NavBtn/NavBtn'
import classes from './NavBar.module.css'

let timeout = null

const NavBar =() =>{

    const history = useHistory()
    const dispatch = useDispatch()
    const isSignedIn = useSelector((state) => state.authReducer.isSignedIn)
    const profile = useSelector((state) => state.authReducer.profile)
    const token = useSelector((state) => state.authReducer.authToken)
    const autoSignOutTime = useSelector((state) => state.authReducer.autoSignOutTime)
    
    const expireTime = new Date( parseInt(localStorage.getItem('authExpireTiime')) ).getTime()
    //const [isActive, setIsActive] = useState('/')

    if(!timeout)
    {
        timeout = setTimeout(() => {
            dispatch(authReducerActions.signOut())
            timeout = null
        }, (expireTime - new Date(Date.now()).getTime()) - 300000);
    }

    const signOutHandler = () =>{
        dispatch(authReducerActions.signOut())
        history.push('/')
    }

    window.addEventListener('resize',()=>{
        dispatch(dimensionsActoins.setInnerWidth({screenInnerWidth: window.innerWidth}))
    })

    useEffect(()=>{
        dispatch(dimensionsActoins.setInnerWidth({screenInnerWidth: window.innerWidth}))
        //setIsActive(history.location.pathname)

        dispatch(authReducerActions.checkAuthStatus())

        if(!localStorage.getItem('authExpireTiime'))
        {
            history.push('/')
            dispatch(authReducerActions.signOut())
        }

        const curTime = new Date(Date.now()).getTime()


        if(curTime > expireTime // - (60000 * 5)
        )//5 mins prior to actual expire time
        {
            dispatch(authReducerActions.signOut()) 
            history.push('/')
        }

        //set profile
        dispatch(getProfileAction(localStorage.getItem('uid')))

    },[history,dispatch, isSignedIn, expireTime, 
        //isActive
    ])

    useEffect(()=>{
        if(localStorage.getItem('uid'))
        {
            if(isSignedIn)
            {
                //console.log({remaningT:  parseInt(autoSignOutTime) - new Date(Date.now()).getTime()})
                dispatch(getProfileAction(localStorage.getItem('uid'),token))
            }
        }
    },[dispatch, isSignedIn, token, autoSignOutTime])
    

    // const isActiveHandler = (route) => {
    //     setIsActive(route)
    // }

    return (
    <header className={classes['nav-bar']}>
        {isSignedIn ?
        <> 
            {profile && <div className={classes['profile-wrapper']}>
                <h2>{profile.fName} {profile.lName.slice(0,1)}.</h2>
            </div>}
             
            <NavBtn 
                //onClick={isActiveHandler}
                to='/log' title='Log' 
                //isActive={isActive.includes('/log')}
            />
            
            <NavBtn
                //onClick={isActiveHandler}
                to='/date-selection' title='Dashboard' 
                //isActive={isActive.includes('/date-selection')}
            />
            
            <NavBtn 
                // onClick={isActiveHandler}
                to='/stats' title='Stats' 
                // isActive={isActive.includes('/stats')}
            />

            <div className={classes['logout-wrapper']}>
                <button className={classes.logout} onClick={signOutHandler}>logout</button>
            </div>
            
        </> :
        <>
            <NavBtn 
                // onClick={isActiveHandler}
                to='/' title='home' 
                // isActive={isActive.includes('/stats')}
            />
            <NavBtn 
                // onClick={isActiveHandler}
                to='/auth' title='sign-in' 
                // isActive={isActive.includes('/stats')}
            />
        </>
        }
    </header>
    )
}

export default NavBar