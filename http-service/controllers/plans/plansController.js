import planService from "../../service/plans/plans_service.js";
import PlanDTO from "../../DTO/plansDTO.js";
import { v4 as uuidv4 } from "uuid";

const savePlans = async (req, res) => {
    try {

        const planID = uuidv4();

        const plansDTO = new PlanDTO(
            planID,
            req.body.title,
            req.user.userID,
            req.body.description,
            req.body.dietPlan,
            req.body.exercisePlan,
            req.body.price,
            req.body.subscribers
        );

        const plan = await planService.savePlans(plansDTO);

        if (plan) {

            res.status(200).json({
                message: "Plan saved successfully",
                plan: plansDTO
            });

        } else {

            res.status(401).json({
                message: "Error in saving plan"
            });

        }

    } catch (err) {

        console.error('Error in savePlans controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const getMyPlans = async (req, res) => {
    try {

        const myPlans = await planService.getAllPlans(req.user.userID);

        if (myPlans) {

            res.status(201).json({
                message: "Plans retrieved successfully",
                plans: myPlans
            });

        } else {

            res.status(401).json({
                message: "Error in retrieving plans"
            });

        }
    } catch (err) {

        console.error('Error in getting my plans controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const updateMyPlan = async (req, res) => {
    try {
        const planID = req.params.planID;

        const planDTO = new PlanDTO(
            planID,
            req.body.title,
            req.user.userID,
            req.body.description,
            req.body.dietPlan,
            req.body.exercisePlan,
            req.body.price,
            req.body.subscribers
        );

        const updatedPlan = await planService.updatePlan(planDTO);

        if (updatedPlan) {

            res.status(200).json({
                message: "Plan updated successfully",
                plan: updatedPlan
            });

        } else {

            res.status(401).json({
                message: "Error in updating plan"
            });

        }
    } catch (err) {

        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const deleteMyPlan = async (req, res) => {
    try {

        const planID = req.params.planID;
        const userID = req.user.userID;

        const plan = await planService.deletePlan(planID, userID);

        if (plan) {

            res.status(200).json({
                message: "Plan deleted successfully"
            });

        } else {

            res.status(401).json({
                message: "Error in deleting plan"
            });

        }

    } catch (err) {

        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

export { savePlans, getMyPlans, updateMyPlan, deleteMyPlan };