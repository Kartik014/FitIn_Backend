import chatService from "../service/chat/chat_service.js";
import MessageDTO from "../DTO/messageDTO.js";
import { v4 as uuidv4 } from "uuid";

function initializeChatSocket(io) {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);
        const roomID = await chatService.getRoomIDS(socket.user.id);
        roomID.forEach((roomID) => {
            socket.join(roomID);
        });

        socket.on('send_message', async (data) => {
            const mid = uuidv4();
            const messageDTO = new MessageDTO(
                data.data.roomID || null,
                data.data.senderID,
                data.data.receiverID,
                mid,
                data.data.body,
                data.data.isFile,
                data.data.file,
                data.data.isForwarded,
                data.data.isDeleted
            )

            try {
                const message = await chatService.sendMessage(messageDTO);
                io.to(message.roomID).emit('receive_message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}

export default initializeChatSocket;