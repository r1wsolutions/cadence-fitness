
export const weeklyStats = async (e,months,token,uid) =>{ 

    let monthSnapshot = {
        week1: []
    }

    const year = e.target.year.value
    const month = e.target.month.value
    const monthIndex = months.findIndex((m)=>m === month)

    try {
        const fetchReq = await fetch(
            `https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${year}/${monthIndex}.json?auth=${token}`)
        
        const fetchResponse = await fetchReq.json()

        if(!fetchResponse)
        {
            let responseErr = new Error()
            responseErr.message = 'no workouts found for selection'
            throw responseErr
        }

        if(fetchReq.ok && fetchResponse !== null)
        {
            //collect monthly workouts
            const daysWorkedOut = []
            
            //this loop represents a day
            for(let i in fetchResponse)
            {
                let date = new Date(i)
                let nameToAdd = ''
                //check if we have info for that day
                
                //save day
                const dayToBeSaved = {
                    date: date,
                    workouts: []
                }
                let totalCount = 0
                //loop through all workouts for that day then add workouts completed that day
                for(let j in fetchResponse[i])
                {
                    nameToAdd = j
                    //const workoutNameIndex =  dayToBeSaved.workouts.findIndex((name)=> name === j)
                    totalCount = 0

                    //drill for the amounts of each set
                    for(let k in fetchResponse[i][j])
                    {
                        totalCount+= parseInt(fetchResponse[i][j][k].amount)
                    }

                    dayToBeSaved.workouts.push({
                        name: nameToAdd,
                        total: parseInt(totalCount)
                    })
                    
                }

                daysWorkedOut.push(dayToBeSaved)
            }
            
            //get all the days of the month
            daysWorkedOut.sort((a,b)=> a.date-b.date)
            
            let daysOfTheMonth = []

            let dayOfMonth = new Date(`${month}-1-${year}`)

            //substract the month by 1 because we are now using the index for the month which is 0 based
            let totalDays = new Date(dayOfMonth.getFullYear(), dayOfMonth.getMonth() - 1, 0).getDate()
         
            
            for(let i = 1; i < totalDays + 1; i++)
            {
                
                daysOfTheMonth.push(new Date(`${month}-${i}-${year}`))

            }
       
            let prevMonthIndex = dayOfMonth.getMonth()//no need to substract because this is not 0 based

            const previousMonthTotalDays = new Date(dayOfMonth.getFullYear(),prevMonthIndex,0).getDate()
            let sundayOfFirstWeek = previousMonthTotalDays - (daysOfTheMonth[0].getDay() - 1)

            //this is the first Sunday of the week/first day of the week if the first day of the month does not start on Sunday
            const firstSundayOfFirstWeek = new Date(dayOfMonth.getFullYear(),prevMonthIndex - 1,sundayOfFirstWeek)
            let daysDifToAdd = daysOfTheMonth[0].getDay() - firstSundayOfFirstWeek.getDay()
            let previousMonthCounter = firstSundayOfFirstWeek.getDate()
            
            //back tracking and adding the first days of the first week that were in the previous month
            for(let i = 0; i< daysDifToAdd; i++)
            {
                
                daysOfTheMonth.splice(i,0,new Date(dayOfMonth.getFullYear(),prevMonthIndex - 1,previousMonthCounter))
                previousMonthCounter++
            }

            
            //create week one
            let weekOneDates = []
            
            for(let i = 0; i < 7  ; i++)
            {
                weekOneDates.push(daysOfTheMonth[i])
            }


            weekOneDates.forEach((date)=>{

                daysWorkedOut.forEach((workoutDate) =>{
                    const curDate = new Date(date)
                    const workoutDateObj = new Date(workoutDate.date) 
                    
                    if(curDate.getMonth() === workoutDateObj.getMonth() && curDate.getDate() === workoutDateObj.getDate())
                    {
                        for(let i in workoutDate.workouts)
                        {
                            let containsWorkoutIndex = monthSnapshot.week1.findIndex((repIndex) => repIndex.name === workoutDate.workouts[i].name)
                            
                            if(containsWorkoutIndex < 0)
                            {
                                monthSnapshot.week1.push({...workoutDate.workouts[i],exDate: curDate})
                            }else{
                                monthSnapshot.week1[containsWorkoutIndex].total+= workoutDate.workouts[i].total
                            }
                        }
                    }
                })
            })

            totalDays = daysOfTheMonth.length

            const totalWeeks = parseInt(36/7)
            
            let createNewWeek = true
            
            //getting second week info and creating the second week
            //this process can be used to create remaining weeks
            let weekBeingAdded = 2

            do{
                monthSnapshot[`week${weekBeingAdded}`] = []
                
                //here we are looping through every remaining day of the week we have generated above
                const initIndex = (7 * (weekBeingAdded - 1))
                let escapeValue = 7 + initIndex

                if(escapeValue > daysOfTheMonth.length)
                {
                    escapeValue = daysOfTheMonth.length
                }

                for(let i = initIndex; i < escapeValue; i++)
                {
                    for(let a = 0; a < daysWorkedOut.length; a++)
                    {
                        const curDate = daysOfTheMonth[i]
                        let woDateObj =  new Date(daysWorkedOut[a].date)

                        if(curDate.getMonth() === woDateObj.getMonth() && curDate.getDate() === woDateObj.getDate())
                        {
                            for(let j in daysWorkedOut[a].workouts)
                            {
                                let containsWorkoutIndex = monthSnapshot[`week${weekBeingAdded}`].findIndex((repIndex) => repIndex.name === daysWorkedOut[a].workouts[j].name)
                                
                                if(containsWorkoutIndex < 0)
                                {
                                    monthSnapshot[`week${weekBeingAdded}`].push({...daysWorkedOut[a].workouts[j], exDate: curDate})
                                }else{
                                    monthSnapshot[`week${weekBeingAdded}`][containsWorkoutIndex].total+= daysWorkedOut[a].workouts[j].total
                                }
                            }
                        }
                    }
                }
                
                if(weekBeingAdded === totalWeeks)
                {
                    createNewWeek = false
                }

                weekBeingAdded++
            }while(createNewWeek)

            return monthSnapshot
        }

    } catch (error) {
        return {error: error}
    }
}


export const monthlyStats = async (year, token, uid) => {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ];

    try {
        let tempArray = []
        let exercisesCollection = []
        const fetchReq = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${year}.json?auth=${token}`)
        
        const fetchResponse = await fetchReq.json()

        if(!fetchResponse)
        {
            let responseErr = new Error()
            responseErr.message = 'no workouts completed for that year'
            throw responseErr
        } 
            
        if(fetchReq.ok && fetchResponse !== null)
        {
            for (let index = 0; index < 12; index++) 
            {
                tempArray.push({
                    monthIndex: index,
                    title: monthNames[index],
                    reps: 0,
                    exercisesCompleted: []
                })    
            }

            //for an actual collection
            if(fetchResponse.length > 0)
            {
                //loop through all the months
                fetchResponse.forEach((fR,fI)=>{
                    if(fR !== null)
                    {
                        //loop through the days worked out
                        for(let fetchedDate in fR)
                        {
                            const monthOfEx = new Date(fetchedDate).getMonth()
    
                            //loop through the exercises performed (not set)
                            for(let exercise in fR[fetchedDate])
                            {
                                const alreadyHaveEx = exercisesCollection.findIndex((exFromCol) => exFromCol === exercise)
    
                                if(alreadyHaveEx < 0)
                                {
                                    exercisesCollection.push(exercise)
                                }
    
                                //loop through the exercises completed under the exercise performed (obj with amount and details)
                                for(let data in fR[fetchedDate][exercise])
                                {
                                    tempArray[monthOfEx].exercisesCompleted.push({
                                        exercise: fR[fetchedDate][exercise][data].exercise,
                                        reps: fR[fetchedDate][exercise][data].amount
                                    })
                                }
                            }
                        }
                    }
    
                    //incase there was a month where no workouts were completed
                    if(fetchResponse[fI] !== null)
                    {    
                        const foundMonth = tempArray.findIndex((tA)=> tA.monthIndex === fI)
    
                        tempArray[foundMonth].reps = 1
                    }
                })
            }else{
                //for single days
                //access the obj with all the info
                for(let obj in fetchResponse)
                {
                    //access the day with the exercises performed
                    for(let date in fetchResponse[obj])
                    {
                        const monthOfEx = new Date(date).getMonth()
    
                        //access the exercises completed for that day (not the sets)
                        for(let ex in fetchResponse[obj][date])
                        {
                            const alreadyHaveEx = exercisesCollection.findIndex((exFromCol) => exFromCol === ex)
    
                            if(alreadyHaveEx < 0)
                            {
                                exercisesCollection.push(ex)
                            }

                            //access and loop through the sets completed for exercise
                            for(let set in fetchResponse[obj][date][ex])
                            {                                
                                tempArray[monthOfEx].exercisesCompleted.push({
                                    exercise: fetchResponse[obj][date][ex][set].exercise,
                                    reps: fetchResponse[obj][date][ex][set].amount
                                })
                            }
                        }
                    }
                }
            }

            return {
                exercisesCompleted: exercisesCollection,
                exercisesRawData: tempArray
            }
        }

    } catch (error) {
        
        return {error: error}
    }
}

export const annualStats = async (uid,token) => {
    
    const yearsWorkedOut = []
    const exercisesCompleted = []
    
    try {
        
        const fetchReq = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts.json?auth=${token}`)

        const fetchResponse = await fetchReq.json()

        if(!fetchResponse)
        {
            let responseErr = new Error()
            responseErr.message = 'no data yet, start working out!'

            throw responseErr
        }

        if(fetchReq.ok)
        {
            for(let year in fetchResponse)
            {
                let tempExCollection = []
                
                for(let month in fetchResponse[year])
                {
                    for(let day in fetchResponse[year][month])
                    {
                        for(let exerciseName in fetchResponse[year][month][day])
                        {
                            const exNameIndex = exercisesCompleted.findIndex((ex)=> ex === exerciseName)

                            if(exNameIndex < 0)
                            {
                                exercisesCompleted.push(exerciseName)
                            }

                            for(let exSet in fetchResponse[year][month][day][exerciseName])
                            {
                                const objToPush = fetchResponse[year][month][day][exerciseName][exSet]

                                tempExCollection.push({
                                         exercise: objToPush.exercise,
                                         reps: objToPush.amount
                                    })
                            }
                        }
                    }
                }

                yearsWorkedOut.push({
                    year: year,
                    workouts: tempExCollection
                })
            }

            return {
                yearsWorkedOut: yearsWorkedOut,
                exercisesCompleted: exercisesCompleted
            }
            
        }else{
            let fetchError = new Error()
            fetchError.message = fetchResponse.error.message
            throw fetchError
        }   

    } catch (error) {
        
        return {error: error}
    }
}

export const customStats = async (dates, uid, token) =>{

    const requestsCollection = []
    const responsesCollection = [] 

    //let's narrow down simplest first, within same year
    if(dates.from.getFullYear() === dates.to.getFullYear())
    {
        console.log('In Same Year')
        
        //if within same year, let's check if inquery is within the same month
        if(dates.from.getMonth() === dates.to.getMonth())
        {
            console.log('same month')
            const fetchReq = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${dates.from.getFullYear()}/${dates.from.getMonth()}.json?auth=${token}`)

            const fetchResponse = await fetchReq.json()
            const selectedWorkouts = []
            const workoutNames = []

            for(const date in fetchResponse)
            {
                const loopDate = new Date(date)
                
                if(loopDate.getTime() <= dates.to.getTime() && loopDate.getTime() >= dates.from.getTime())
                {
                    //looping through every set performed within a given date
                    for(const wo in fetchResponse[date])
                    {
                        let exerciseToAdd = null

                        const workoutExist = workoutNames.findIndex((name)=>name === wo)

                        //if it does not exist then we add to collection
                        if(workoutExist === -1)
                        {
                            workoutNames.push(wo)
                        }

                        for(const data in fetchResponse[date][wo])
                        {
                            const workoutData = fetchResponse[date][wo][data]
                            const timeDate = new Date(workoutData.timestampe)

                            if(exerciseToAdd === null)
                            {
                                exerciseToAdd = {
                                    title: `${timeDate.getMonth()+1}-${timeDate.getDate()}-${timeDate.getFullYear()}`,
                                    reps: parseInt(workoutData.amount),
                                    timestamp: workoutData.timestampe,
                                    exercise: workoutData.exercise
                                }
                            }else{
                                
                                if(exerciseToAdd.exercise === workoutData.exercise)
                                {
                                    exerciseToAdd.reps+= parseInt(workoutData.amount)
                                }
                            }
                        }
                        selectedWorkouts.push(exerciseToAdd)
                    }
                }
            }

            selectedWorkouts.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))

            return { 
                workoutNames: workoutNames,
                workouts: selectedWorkouts
            }

        }else{
            console.log('different months')
            let diff = dates.to.getMonth() - dates.from.getMonth() + 1
            
            for(let curMonth = dates.from.getMonth(); curMonth < dates.from.getMonth() + diff; curMonth++)
            {
                requestsCollection.push(fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${dates.from.getFullYear()}/${curMonth}.json?auth=${token}`))
            }
            
            const requestResponses = await Promise.all(requestsCollection)

            requestResponses.forEach((responnse) => {
                responsesCollection.push(responnse.json())
            })

            const fetchResponses = await Promise.all(responsesCollection)
            const workoutNames = []
            const selectedWorkouts = []


            for(let month in fetchResponses)
            {
                for(let date in fetchResponses[month])
                {
                    const loopDate = new Date(date) 
                    if(loopDate.getTime() <= dates.to.getTime() && loopDate.getTime() >= dates.from.getTime())
                    {
                        //looping through every set performed within a given date
                        for(const wo in fetchResponses[month][date])
                        {
                            const workoutExist = workoutNames.findIndex((name)=>name === wo)

                            //if it does not exist then we add to collection
                            if(workoutExist === -1)
                            {
                                workoutNames.push(wo)
                            }
                            
                            let exerciseToAdd = null
                            
                            for(const workoutObj in  fetchResponses[month][date][wo])
                            {
                                const workoutData =  fetchResponses[month][date][wo][workoutObj]
                                const timeDate = new Date(workoutData.timestampe)

                                if(exerciseToAdd === null)
                                {

                                    exerciseToAdd = {
                                        title: `${timeDate.getMonth()+1}-${timeDate.getDate()}-${timeDate.getFullYear()}`,
                                        reps: parseInt(workoutData.amount),
                                        timestamp: workoutData.timestampe,
                                        exercise: workoutData.exercise
                                    }
                                }else{
                                    
                                    if(exerciseToAdd.exercise === workoutData.exercise)
                                    {
                                        exerciseToAdd.reps+= parseInt(workoutData.amount)
                                    }
                                }
                            }
                            selectedWorkouts.push(exerciseToAdd)
                            selectedWorkouts.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))
                        }
                    }
                }
            }

            return { 
                workoutNames: workoutNames,
                workouts: selectedWorkouts
            }
        }
    }else{
        console.log('In Different Years')

        const requests = []
        const responsesJsonData = []
        const yearsDiff = dates.to.getFullYear() - dates.from.getFullYear()


        for(let yr = 0; yr < yearsDiff+1; yr++)
        {
            requests.push(fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${dates.from.getFullYear()+yr}.json?auth=${token}`))
        }

        const responses = await Promise.all(requests)
        responses.forEach((r)=>responsesJsonData.push(r.json()))
        const finalResponseData = await Promise.all(responsesJsonData)

        const allMonths = []
        for(const year in finalResponseData)
        {
            for(const obj in finalResponseData[year])
            {
                allMonths.push(finalResponseData[year][obj])
            }
        }

        const allWorkouts = []
        const workoutNames = []
        
        for(const index in allMonths)
        {

            for(const date in allMonths[index])
            {
                
                const curDate = new Date(date).getTime()
            
                //get all the dates needed for the first year
                if(curDate >= dates.from.getTime() && curDate <= dates.to.getTime())
                {
                    for(const wo in allMonths[index][date])
                    {
                        const workoutExists = workoutNames.findIndex((name)=>name === wo)

                        if(workoutExists < 0)
                        {
                            workoutNames.push(wo)
                        }

                        let exerciseToAdd = null

                        for(const exercise in allMonths[index][date][wo])
                        {
                            const workoutData =  allMonths[index][date][wo][exercise]
                            const timeDate = new Date(workoutData.timestampe)

                            
                            //TODO - Find all random 10-30-2021 workouts added and delete
                                // console.log({
                                //     delete: date,
                                //     timeDate
                                // })
                            

                            if(exerciseToAdd === null)
                            {

                                exerciseToAdd = {
                                    title: `${timeDate.getMonth()+1}-${timeDate.getDate()}-${timeDate.getFullYear()}`,
                                    reps: parseInt(workoutData.amount),
                                    timestamp: workoutData.timestampe,
                                    exercise: workoutData.exercise
                                }
                            }else{
                                
                                if(exerciseToAdd.exercise === workoutData.exercise)
                                {
                                    exerciseToAdd.reps+= parseInt(workoutData.amount)
                                }
                            }
                        }

                        allWorkouts.push(exerciseToAdd)
                    }
                }
            }
        }

        allWorkouts.sort((a,b)=> new Date(a.timestamp) - new Date(b.timestamp))
   

        return {
            workoutNames: workoutNames,
            workouts: allWorkouts
        }
    }    
}