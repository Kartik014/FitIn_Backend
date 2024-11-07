import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
    host: process.env.REDISHOST || '127.0.0.1',
    port: process.env.REDISPORT || '6379',
    password: process.env.REDISPASS || ''
});

redis.on('connect', () => {
    console.log("Connected to Redis");
});

redis.on('error', (error) => {
    console.error('Redis connection error:', error);
});

export default redis;