import chatService from "../service/chat/chat_service.js";
import MessageDTO from "../DTO/messageDTO.js";
import { v4 as uuidv4 } from "uuid";

const userSocketMap = new Map();

function initializeChatSocket(io) {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);
        const userID = socket.user.id;
        userSocketMap.set(userID, socket.id);
        const roomID = await chatService.getRoomIDS(userID);
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
                if (messageDTO.roomID == null) {
                    socket.join(message.roomID);
                    const receiverSocketID = userSocketMap.get(message.receiverID);
                    if (receiverSocketID) {
                        io.to(receiverSocketID).join(message.roomID);
                    }
                }
                io.to(message.roomID).emit('receive_message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('delete_message', async (data) => {
            try {
                const { roomID, mid } = data.data;
                const updatedMessage = await chatService.deleteMessage(roomID, mid);
                if (updatedMessage) {
                    io.to(roomID).emit('message_deleted', updatedMessage);
                }
            } catch (err) {
                console.error('Error deleting message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            userSocketMap.delete(userID);
        });
    });
}

export default initializeChatSocket;