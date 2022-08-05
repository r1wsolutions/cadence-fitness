import { NavLink } from 'react-router-dom'
import classes from './DayOfMonth.module.css'

const DayOfMonth = (props) =>{
    return (
        <NavLink onClick={props.onClick} to={'/details/'+props.id} className={classes.date}>
            {props.month} - {props.day} - {props.year}
            <h2>{props.workedout}</h2>
        </NavLink>
    )
}

export default DayOfMonth