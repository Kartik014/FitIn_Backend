import cron from "node-cron";
import calls from "../database/models/calls/calls.js";

export default function startBulkCallSaveCron() {
    cron.schedule('* * * * *', async () => {
        console.log('Bulk saving calls to PostgreSQL...');
        await calls.bulkCallSave();
    });
}