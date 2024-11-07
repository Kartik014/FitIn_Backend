import mongoose from "mongoose";
import redisClient from "../../../redis/redisClient.js"

const messageSchema = new mongoose.Schema({
    senderID: {
        type: String,
        required: true
    },
    receiverID: {
        type: String,
        required: true
    },
    roomID: {
        type: String,
        required: true
    },
    mid: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    isFile: {
        type: String,
        required: true,
        default: "0"
    },
    file: {
        type: String,
        required: true,
        default: null
    },
    isForwarded: {
        type: String,
        required: true,
        default: "0"
    },
    isDeleted: {
        type: String,
        required: true,
        default: "0"
    },
    timestamp: {
        type: Date
    }
});

const conversationSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: String,
        required: true,
        default: "0"
    },
    participants: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);

const chat = {
    getOrCreateConversation: async (participants) => {
        let conversation = await Conversation.findOne({ participants: { $all: participants } });
        if (!conversation) {
            let roomID = participants.join("_");
            conversation = await Conversation.create({
                roomID,
                participants
            });
        }
        return conversation.roomID.toString();
    },

    getConversationIDS: async (userID) => {
        let conversations = await Conversation.find({ participants: userID });
        let roomIDs = conversations.map(conversation => conversation.roomID.toString());
        return roomIDs;
    },

    bulkChatSave: async () => {
        const keys = await redisClient.keys('chat:*');
        for (const key of keys) {
            const messages = await redisClient.lrange(key, 0, -1);
            const parsedMessages = messages.map(JSON.parse);
            if (parsedMessages.length > 0) {
                await Message.insertMany(parsedMessages, { ordered: false })
                    .then(() => {
                        console.log('Messages inserted successfully');
                    })
                    .catch(err => {
                        console.error('Error inserting messages:', err);
                    });
                await redisClient.del(key);
            }
        }
    },

    getChatHistory: async (roomID, beforeTimestamp, page = 1, limit = 100) => {
        const skip = (page - 1) * limit;
        const query = {
            roomID,
            ...(beforeTimestamp ? { timestamp: { $lt: new Date(beforeTimestamp) } } : {})
        };
        const messages = await Message.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return messages.reverse();
    }
}

export default chat;