import mailService from "../mailservice/mail.js";
import kafka from "./kafkaClient.js";

const consumer = {
    newUserConsumer: async () => {
        const consumer = kafka.consumer({ groupId: "email-service-group" });
        await consumer.connect();

        await consumer.subscribe({
            topics: ["new-user"],
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`${message.value.toString()}`);
                const messageValue = JSON.parse(message.value.toString());
                await mailService.sendVerificationEmail(messageValue.email, messageValue.name, messageValue.otp);
            }
        });
    }
}

export default consumer;