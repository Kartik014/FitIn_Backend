import kafka from "./kafkaClient.js";

const producer = {
    newUserProducer: async (newUser, OTP) => {
        const producer = kafka.producer();
        await producer.connect();

        await producer.send({
            partition: 0,
            topic: "new-user",
            messages: [
                {
                    key: newUser.id.toString(),
                    value: JSON.stringify({
                        name: newUser.username,
                        email: newUser.email,
                        otp: OTP.otp
                    })
                },
            ]
        });

        await producer.disconnect();
    }
}

export default producer;