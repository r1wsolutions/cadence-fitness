import classes from './DayOfMonth.module.css'

//shows date only when no workout complete
const DayOfMonthSkeleton = (props) =>{

    const isEmpty = props.isEmpty
    const dateInfo = `${props.month} - ${props.day} - ${props.year}`

    return (
        <div className={`${classes.skeleton} ${isEmpty && classes.empty} `}>
                {!isEmpty && dateInfo}
            <h2>{props.workedout}</h2>
        </div>
    )
}

export default DayOfMonthSkeleton