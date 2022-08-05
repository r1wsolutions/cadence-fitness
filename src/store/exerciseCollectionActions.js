import {exerciseCollectionActions} from "./exerciseCollectionSlice";

export const retrieveExerciseCollection =(uid, token) =>{

    return async (dispatch) =>{
        try {
            const fetchRequest = await fetch('https://cadence-fitness-default-rtdb.firebaseio.com/'+uid+'.json?auth='+token)

            if(!fetchRequest.ok)
            {
                throw new Error('Failed to load workout data')
            }

            const completedRequest = await fetchRequest.json()

            dispatch(exerciseCollectionActions.replaceExcerciseCollection({
                exerciseCollection: completedRequest
            }))

        } catch (error) {
           console.log('error retr items')
        }
    }
}

export const retrieveMonthlyExerciseCollection =(year, month, uid, token) =>{

    return async (dispatch) =>{
        try {

            const searchYear = year.toString()
            const searchMonth = month.toString()
            
            const fetchRequest = await fetch('https://cadence-fitness-default-rtdb.firebaseio.com/'+uid+'/workouts/'+searchYear+'/'+searchMonth+'.json?auth='+token)


            if(!fetchRequest.ok)
            {
                throw new Error('Failed to load workout data')
            }

            const completedRequest = await fetchRequest.json()

            if(!completedRequest)
            {
                throw new Error('No workouts completed for selected month')
            }
            
            dispatch(exerciseCollectionActions.replaceExcerciseCollection({
                exerciseCollection: completedRequest
            }))

        } catch (error) {
           dispatch(exerciseCollectionActions.replaceExcerciseCollection({
                error: {
                    message: error.message
                }
            }))
        }
    }

}