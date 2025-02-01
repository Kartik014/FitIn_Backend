import mongoose from 'mongoose';
import RedisClient from '../../../redis/redisClient.js';

const dietPlanSchema = new mongoose.Schema({
    morning: [{
        type: String
    }],
    afternoon: [{
        type: String
    }],
    night: [{
        type: String
    }]
});

const exerciseSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    }
});

const dayPlanSchema = new mongoose.Schema({
    diet: {
        type: dietPlanSchema,
        default: () => ({})
    },
    exercises: {
        type: [exerciseSchema],
        default: []
    }
});

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    planID: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dietPlan: {
        type: Map,
        of: dayPlanSchema,
        default: {}
    },
    exercisePlan: {
        type: Map,
        of: dayPlanSchema,
        default: {}
    },
    price: {
        type: Number,
        required: true
    },
    subscribers: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema);

const Plans = {
    bulkSavePlans: async () => {
        try {
            const keys = await RedisClient.keys('user:*:plans');

            if (keys.length === 0) {
                console.log('No keys found in Redis for plans.');
                return;
            }

            const allPlans = [];

            for (const key of keys) {
                const redisData = await RedisClient.lrange(key, 0, -1);
                const parsedData = redisData.map(entry => JSON.parse(entry));
                allPlans.push(...parsedData);
            }

            const formattedPlans = allPlans.map(plan => ({
                title: plan.title,
                planID: plan.planID,
                userID: plan.userID,
                description: plan.description,
                dietPlan: plan.dietPlan,
                exercisePlan: plan.exercisePlan,
                price: plan.price,
                subscribers: plan.subscribers || 0
            }));

            if (formattedPlans.length > 0) {
                await Plan.insertMany(formattedPlans);
                console.log(`Successfully inserted ${formattedPlans.length} plans into MongoDB.`);
            } else {
                console.log('No valid data to insert.');
            }

            await RedisClient.del(...keys);
            console.log(`Deleted ${keys.length} keys from Redis.`);
        } catch (error) {
            console.error('Error during bulk save operation:', error);
            throw error;
        }
    }
}

export default Plans;
