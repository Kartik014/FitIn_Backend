import express from 'express';
import xssClean from "xss-clean";
import authenticateToken from '../middlewares/authenticateToken.js';
import { deleteMyPlan, getMyPlans, savePlans, updateMyPlan } from '../controllers/plans/plansController.js';

const apiRouter = express.Router();

apiRouter
    .route('/myPlans')
    .get(authenticateToken, xssClean(), getMyPlans)

apiRouter
    .route('/create-plan')
    .post(authenticateToken, xssClean(), savePlans)

apiRouter
    .route('/updateMyPlan/:planID')
    .put(authenticateToken, xssClean(), updateMyPlan)

apiRouter
    .route('/deleteMyPlan/:planID')
    .delete(authenticateToken, xssClean(), deleteMyPlan)

export default apiRouter;