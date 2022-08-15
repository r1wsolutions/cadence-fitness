import { useEffect, useState, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import styles from './ApexGraph.module.css'

const ApexGraph = (props) => {

  

  const [isLoading, setIsLoading] = useState(true)
  let dataSet = useMemo(()=>[...props.rawCollection],[props.rawCollection])

  const [categoriesList, setCategoriesList] = useState([])
  const [repsList, setRepsList] = useState([])

    useEffect(()=>{
      const tempCatList = []
      const tempRepsList = []

      dataSet.forEach((res)=>{
        tempCatList.push(res.title)  

        if(res.reps > 0)
        {
          tempRepsList.push(parseInt(res.reps))
        }else{
          tempRepsList.push(parseInt(0))
        }
        
      })

      setCategoriesList(tempCatList)
      setRepsList(tempRepsList)

      setIsLoading(false)

    },[dataSet])


    const options = {
        stroke: {
            width: 5,
            curve: 'smooth',
        },
        chart: {
            height: 350,
            type: 'line',
            zoom: {enabled: false}
        },
        xaxis: {
            //type: 'datetime',
            categories: categoriesList,
            tickAmount: categoriesList.length
            /*
            labels: {  
              formatter: function(value, timestamp, opts) {
                //return opts.dateFormatter(new Date(timestamp), 'dd MMM')
                return opts.dateFormatter(new Date(timestamp), 'MM/dd')
              }
            }*/
            
          }
    }

    const chartData=[
        {
          name: props.title,
          type: 'bar',
          fill: 'solid',
          data: repsList,
        },
      ]

    return (
        <div className={styles.wrapper}>
            <div className={styles['center-holder']}>
              <h1>{props.title}</h1>
            </div>
            
            {isLoading ? 
            <div className={styles['center-holder']}>
              <h1>LOADING</h1>
            </div>
            
            : <div className={styles['center-holder']}>
              <ReactApexChart 
                  type='line'
                  options={options}    
                  height={500}
                  width={props.windowWidth * .9}
                  series={chartData}
              />
            </div>}
            
        </div>
    )
}

export default ApexGraph