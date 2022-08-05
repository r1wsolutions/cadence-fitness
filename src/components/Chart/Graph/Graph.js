import { useState, useRef, useEffect, useMemo } from 'react'
import Bar from '../Bar/Bar'
import classes from './Graph.module.css'

const Graph = (props) =>{ 

  const [isLoading, setIsLoading] = useState(true)
  let highestRep = useRef(0)

  let dataSet = useMemo(()=>[...props.rawCollection],[props.rawCollection])
  const [finalDataset, setFinalDataset] = useState([])
 
  useEffect(()=>{

    let finalTempSet = []
    
    dataSet.forEach((r)=>{

      if(r.reps > highestRep.current)
      {
        highestRep.current = r.reps
      }

    })

    dataSet.forEach((r,i)=>{
      let percentage = ((r.reps/highestRep.current) * 100).toFixed(0).toString()+'%'

      dataSet[i].percentage = percentage

      finalTempSet.push({
        title: dataSet[i].title,
        percentage: dataSet[i].percentage,
        total: r.reps > 0 ? r.reps : 0
      }) 

    })

    if(finalTempSet.length === dataSet.length)
    {
      setIsLoading(false)
      setFinalDataset(finalTempSet)
    }
    

  },[isLoading, dataSet, highestRep]) 


    return (
        <div className={`${classes['wrapper']}  ${props.changeBackground &&  classes['change-background']}`}>
            <h2>{props.title}</h2>
            <div className={`${classes['graph-holder']} 
              ${props.customSet && classes['custom-set']}
              ${props.changeStart && classes['change-start']}`}  
            >
            {finalDataset.length === dataSet.length && finalDataset.map((r,i)=>
                {
                  return r.percentage && <Bar
                              key={i}
                              percentage={r.percentage}
                              title={r.title}
                              total={r.total && r.total}
                              isLong={props.isLong}
                          />
                }
            )}
            </div>
        </div>
        )
}

export default Graph