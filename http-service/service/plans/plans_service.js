import RedisClient from '../../redis/redisClient.js';

const planService = {
    savePlans: async (plansDTO) => {
        try {
            const userKey = `user:${plansDTO.userID}:plans`;

            const existingPlans = await planService.getAllPlans(userID) || [];
            existingPlans.push(planData);

            const plansString = JSON.stringify(existingPlans);

            await RedisClient.set(userKey, plansString);

            console.log(`Plan for user ${userID} stored successfully.`);
            return true;
        } catch (error) {
            console.error(`Error storing plan for user ${userID}:`, error.message);
            throw error;
        }
    },

    getAllPlans: async (userID) => {
        try {
            const userKey = `user:${userID}:plans`;
            const plansString = await RedisClient.get(userKey);

            if (plansString) {
                const plans = JSON.parse(plansString);
                console.log(`Plans for user ${userID} retrieved successfully.`);
                return plans;
            } else {
                console.log(`No plans found for user ${userID}.`);
                return [];
            }
        } catch (error) {
            console.error(`Error retrieving plans for user ${userID}:`, error.message);
            throw error;
        }
    },

    updatePlan: async (plansDTO) => {
        try {
            const existingPlans = await planService.getAllPlans(plansDTO.userID);

            if (!existingPlans.length) {
                console.log(`No plans found for user ${plansDTO.userID}.`);
                return false;
            }

            const updatedPlans = existingPlans.map(plan =>
                plan.planID === plansDTO.planID ? { ...plan, ...plansDTO } : plan
            );

            const userKey = `user:${plansDTO.userID}:plans`;
            await RedisClient.set(userKey, JSON.stringify(updatedPlans));

            console.log(`Plan ${plansDTO.planID} for user ${plansDTO.userID} updated successfully.`);
            return true;
        } catch (error) {
            console.error(`Error updating plan ${plansDTO.planID} for user ${plansDTO.userID}:`, error.message);
            throw error;
        }
    },

    deletePlan: async (planID, userID) => {
        try {
            const existingPlans = await planService.getAllPlans(userID);

            if (!existingPlans.length) {
                console.log(`No plans found for user ${userID}.`);
                return false;
            }

            const updatedPlans = existingPlans.filter(plan => plan.planID !== planID);

            const userKey = `user:${userID}:plans`;
            await RedisClient.set(userKey, JSON.stringify(updatedPlans));

            console.log(`Plan ${planID} for user ${userID} deleted successfully.`);
            return true;
        } catch (error) {
            console.error(`Error deleting plan ${planID} for user ${userID}:`, error.message);
            throw error;
        }
    }
}

export default planService;