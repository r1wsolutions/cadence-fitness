
export const postDummyExercises = async (count, year, exercises, uid, token) =>{

    let message = ''
    let hasError = false
    let intervals = 0
    
    for(let i = 0; i < count; i++)
    {
        intervals++

        try {
            let nameIndex = parseInt(Math.floor(Math.random() * exercises.length))

            const exercise = exercises[nameIndex].name
            let qty = Math.floor(Math.random() * 125)

            if(exercise.length < 1 || qty.length < 1)
            {
                throw new Error('Please enter a valid amount!')
            }

            if(parseInt(qty) < 1)
            {
                qty = 5
            }
           
            let randomMonth = Math.floor(Math.random() * 10)
            let randomDate = Math.floor(Math.random() * 28)
            const date = new Date(`${randomMonth + 1}-${randomDate + 1}-${year}`)


            const workout = {
                exercise: exercise,
                amount: qty,
                timestampe: date
            }

            // console.log({
            //     paylaod: workout,
            //     address:`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${date.getFullYear()}/${date.getMonth()}/${date}/${exercise}/.json?auth=${token}`
            // })
                

            const postRequest = await fetch(`https://cadence-fitness-default-rtdb.firebaseio.com/${uid}/workouts/${date.getFullYear()}/${date.getMonth()}/${date}/${exercise}/.json?auth=${token}`,{
                method: "POST",
                body: JSON.stringify(workout)
            })

            const postResponse = await postRequest.json()
            if(postRequest.ok)
            {
                console.log(postResponse)
            }else{
                throw new Error(postResponse.error)
            }
            
        } catch (error) {
            hasError = true
            message = error.message
            break
        }
    }

    if(!hasError) message = 'all done'

    return {
        message: message,
        hasError: hasError,
        intervalsCompleted: intervals
    }
}