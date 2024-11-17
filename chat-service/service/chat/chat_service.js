import chat from "../../database/models/message/message.js";
import redisClient from "../../redis/redisClient.js";

const chatService = {
    sendMessage: async (messageDTO) => {

        const participants = [messageDTO.senderID, messageDTO.receiverID];

        const roomID = messageDTO.roomID || await chat.getOrCreateConversation(participants);

        const message = {
            roomID,
            senderID: messageDTO.senderID,
            receiverID: messageDTO.receiverID,
            mid: messageDTO.mid,
            body: messageDTO.body,
            isFile: messageDTO.isFile || "0",
            file: messageDTO.file || null,
            isForwarded: messageDTO.isForwarded || "0",
            timestamp: new Date()
        };

        try {
            await redisClient.rpush(`chat:${roomID}`, JSON.stringify(message));
        } catch (error) {
            console.error('Error pushing message to Redis:', error);
            throw error;
        }

        return message;
    },

    getChatHistory: async (roomID, beforeTimestamp, page, limit) => {

        const chatHistory = await chat.getChatHistory(roomID, beforeTimestamp, page, limit);

        return chatHistory;
    },

    getRoomIDS: async (userID) => {

        const roomIDS = await chat.getConversationIDS(userID);

        return roomIDS;
    },

    deleteMessage: async (roomID, messageID) => {

        try {

            const messages = await redisClient.lrange(`chat:${roomID}`, 0, -1);

            for (let i = 0; i < messages.length; i++) {
                const message = JSON.parse(messages[i]);

                if (message.mid === mid) {

                    message.body = "This message was deleted";
                    message.isDeleted = "1";
                    await redisClient.lset(`chat:${roomID}`, i, JSON.stringify(message));

                    return message;
                }

            }

            const updatedMessage = await chat.deleteMessage(messageID);

            if (updatedMessage) {
                return updatedMessage;
            }

        } catch (err) {

            console.error('Error deleting message:', err);
            throw err;

        }

    }
}

export default chatService;