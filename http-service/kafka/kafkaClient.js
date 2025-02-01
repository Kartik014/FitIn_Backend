import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "FitIn",
  brokers: ["10.22.15.92:9093"],
  // brokers: ["kafka:9092"]
});

export default kafka;
