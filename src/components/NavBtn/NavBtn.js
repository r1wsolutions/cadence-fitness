import { NavLink } from "react-router-dom"
import classes from './NavBtn.module.css'

const NavBtn = (props) => {

    return (
        <NavLink
            // onClick={()=>{
            //     props.onClick(props.to)
            // }}
            className={`${classes['btn']} 
                
                //    props.isActive && classes.active
                
            `} 
            to={props.to}
            exact activeClassName={classes.active}
        >
            {props.title}
        </NavLink>
    )
}

export default NavBtn