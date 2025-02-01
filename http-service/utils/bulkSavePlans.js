import cron from "node-cron";
import plans from "../database/models/plans/plans.js";

export default function startBulkCallSaveCron() {
    cron.schedule('* * * * *', async () => {
        console.log('Bulk saving plans to MongoDB...');
        await plans.bulkSavePlans();
    });
}