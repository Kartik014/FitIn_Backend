import kafka from "./kafkaClient.js";

const createTopic = async (topicName, numPartitions) => {
    const admin = kafka.admin();
    await admin.connect();

    try {
        const existingTopics = await admin.listTopics();
        if (existingTopics.includes(topicName)) {
            console.log(`Topic "${topicName}" already exists. No new topic created.`);
            return;
        }

        await admin.createTopics({
            topics: [{
                topic: topicName,
                numPartitions: numPartitions,
                replicationFactor: 1,
            }],
        });
        console.log(`Topic "${topicName}" created with ${numPartitions} partitions.`);
    } catch (error) {
        console.error(`Failed to create topic "${topicName}":`, error);
    } finally {
        await admin.disconnect();
    }
};

export default createTopic;