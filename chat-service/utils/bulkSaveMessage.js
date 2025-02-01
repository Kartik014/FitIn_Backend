import cron from "node-cron";
import chat from "../database/models/message/message.js";

export default function startBulkChatSaveCron() {
    cron.schedule('* * * * *', async () => {
        console.log('Bulk saving messages to MongoDB...');
        await chat.bulkChatSave();
    });
}