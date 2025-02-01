class PlanDTO {
    constructor(planID, title, userID, description, dietPlan, exercisePlan, price, subscribers) {
        this.planID = planID;
        this.title = title;
        this.userID = userID;
        this.description = description || '';
        this.dietPlan = this.mapDietPlan(dietPlan);
        this.exercisePlan = this.mapExercisePlan(exercisePlan);
        this.price = price;
        this.subscribers = subscribers || 0;
    }

    mapDietPlan(dietPlan) {
        const mappedDietPlan = {};
        for (const [day, details] of Object.entries(dietPlan || {})) {
            mappedDietPlan[day] = {
                morning: details.diet?.morning || [],
                afternoon: details.diet?.afternoon || [],
                night: details.diet?.night || []
            };
        }
        return mappedDietPlan;
    }

    mapExercisePlan(exercisePlan) {
        const mappedExercisePlan = {};
        for (const [day, details] of Object.entries(exercisePlan || {})) {
            mappedExercisePlan[day] = {
                exercises: details.exercises?.map(exercise => ({
                    exerciseName: exercise.exerciseName || '',
                    sets: exercise.sets || 0,
                    reps: exercise.reps || 0
                })) || []
            };
        }
        return mappedExercisePlan;
    }
}

export default PlanDTO;
