import classes from './MonthlyStatDetail.module.css'

const MonthlyStatDetail = (props) =>{
    return (
        <div className={classes.stat}>
            <h2 className={classes.count}>{props.count}</h2>
            <p className={classes.title}>{props.title}</p>
        </div>
    )
}

export default MonthlyStatDetail