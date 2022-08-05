
import classes from './Bar.module.css'

const Bar = (props) => {
    return (
        <div className={`${classes['stat']} ${props.isLong && classes.long}`}>
            <div className={classes.outer}>
                <div className={classes.inner} style={{
                    height: props.percentage
                }} > 
                </div>
            </div>
            <p className={classes.title}>{props.title}</p>
            <p className={`${classes['total']} ${props.isLong && classes.long}`}>{props.total && props.total}</p>
        </div>
    )
}

export default Bar 