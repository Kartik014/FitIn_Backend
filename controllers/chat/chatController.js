import chatService from "../../service/chat/chat_service.js";

const getChathistory = async (req, res) => {
    try {

        const { roomID, beforeTimeStamp, page, limit } = req.body;
        const chatHistory = await chatService.getChatHistory(roomID, beforeTimeStamp, page, limit);

        res.status(200).json({
            message: "Chat history retrieved successfully",
            chat: chatHistory
        });

    } catch (err) {

        console.error("Error in getChathistory controller:", err);
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message
        });

    }
}

export { getChathistory }