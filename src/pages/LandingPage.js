import { useSelector } from 'react-redux'
import ApexGraph from '../components/Chart/Graphs/ApexGraph'
import classes from './LandingPage.module.css'


const LandingPage = () =>{

    
    const dailyDummyData = [
        {reps: 10, title: 'sun'},
        {reps: 50, title: 'mon'},
        {reps: 20, title: 'tues'},
        {reps: 34, title: 'wed'},
        {reps: 45, title: 'thur'},
        {reps: 65, title: 'fri'},
        {reps: 100, title: 'sat'},
      ]
    
    const weeklyDummyData = [
        {reps: 100, title: 'week - 1'},
        {reps: 86, title: 'week - 2'},
        {reps: 20, title: 'week - 3'},
        {reps: 90, title: 'week - 4'},
        {reps: 85, title: 'week - 5'}
    ]
    
    const monthlyDummyData = [
        {reps: 550, title: 'jan'},
        {reps: 780, title: 'feb'},
        {reps: 600, title: 'mar'},
        {reps: 434, title: 'apr'},
        {reps: 345, title: 'jun'},
        {reps: 765, title: 'jul'},
        {reps: 800, title: 'aug'},
        {reps: 975, title: 'sep'},
        {reps: 255, title: 'oct'},
        {reps: 900, title: 'nov'},
        {reps: 1000, title: 'dec'}
    ]
    

    const annualDummyData = [
        {reps: 5550, title: '2019'},
        {reps: 10780, title: '2020'},
        {reps: 13600, title: '2021'},
        {reps: 16434, title: '2022'}
    ]


    const screenInnerWidth = useSelector((state) => state.dimensionsReducer.screenInnerWidth)

    return (<div className={classes.wrapper}>
        <div className={classes.top}>
            <div className={classes['main-image']}>
                <div className={classes['background-apply']}>
                    <h1 className={classes['main-image__title']}>track your progress</h1>
                    <ul className={classes.ul}>
                        <li className={classes.li}>every rep</li>
                        <li className={classes.li}>every set</li>
                        <li className={classes.li}>every beat</li>
                    </ul>
                </div>
            </div>
        </div>
        <ApexGraph
            title='daily'
            rawCollection={dailyDummyData}
            windowWidth={screenInnerWidth}
        />
        <ApexGraph 
            title={'weekly'} 
            rawCollection={weeklyDummyData}
            windowWidth={screenInnerWidth}
        />
        <ApexGraph 
            title={'monthly'} 
            rawCollection={monthlyDummyData}
            windowWidth={screenInnerWidth}
        />
        <ApexGraph 
            title={'annually'} 
            rawCollection={annualDummyData}
            windowWidth={screenInnerWidth}
        />
    </div>)
}

export default LandingPage