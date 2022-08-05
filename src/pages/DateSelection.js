import { useState } from "react";
import { NavLink } from "react-router-dom";
import classes from './DateSelection.module.css'
const DateSelection =() => {
    
    const years = [
        '2022',
        '2021',
        '2020',
        '2019'
    ]

    
    const [selectedYear, setSelectedYear] = useState(years[0])

    const months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];


    return (<div className={classes.wrapper}>
                <select className={classes.year} onChange={(e)=>{
                    setSelectedYear(e.target.value)
                }}>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                
                <div className={classes['month-wrapper']}>
                    {months.map((m)=><NavLink key={m} className={classes.month} to={`/dashboard/${selectedYear}/${months.findIndex((month) => month === m)}`}>{m}</NavLink>)}
                </div>
                
            </div>)
}

export default DateSelection