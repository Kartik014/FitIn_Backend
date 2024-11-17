import chatService from "../service/chat/chat_service.js";
import MessageDTO from "../DTO/messageDTO.js";
import { v4 as uuidv4 } from "uuid";
import callService from "../service/call/call_service.js";
import CallsDTO from "../DTO/callsDTO.js";

const userSocketMap = new Map();
const userCallStatus = new Map();
const callTimeOutMap = new Map();

function initializeChatSocket(io) {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);
        const userID = socket.user.id;
        userSocketMap.set(userID, socket.id);
        const roomID = await chatService.getRoomIDS(userID);
        roomID.forEach((roomID) => {
            socket.join(roomID);
        });

        socket.on('show_status', async (data) => {
            const receiverSocketID = userSocketMap.get(data.data.receiverID);
            if (receiverSocketID) {
                const receiverSocket = io.sockets.get(receiverSocketID);
                if (receiverSocket) {
                    if (receiverSocket.connected) {
                        socket.to(data.data.roomID).emit('get_status', "Online");
                    }
                }
            } else {
                io.to(data.data.roomID).emit('get_status', "Offline");
            }
        });

        socket.on('show_typing', async (data) => {
            const receiverSocketID = userSocketMap.get(data.data.receiverID);
            if (receiverSocketID) {
                const receiverSocket = io.sockets.get(receiverSocketID);
                if (receiverSocket) {
                    if (receiverSocket.connected) {
                        if (data.data.showTyping == 1) {
                            socket.to(data.data.roomID).emit('typing_status', "typing...");
                        } else if (data.data.showTyping == 2) {
                            socket.to(data.data.roomID).emit('typing_status', "Online");
                        }
                    }
                }
            } else {
                io.to(data.data.roomID).emit('get_status', "Offline");
            }
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
                socket.to(message.roomID).emit('receive_message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('delete_message', async (data) => {
            try {
                const { roomID, mid } = data.data;
                const updatedMessage = await chatService.deleteMessage(roomID, mid);
                if (updatedMessage) {
                    socket.to(roomID).emit('message_deleted', updatedMessage);
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

function initializeCallSocket(io) {
    io.on('connection', async (socket) => {
        const userID = socket.user.id;

        socket.on('outgoing_call', async (data) => {
            try {
                const receiverSocketID = userSocketMap.get(data.data.receiverID);
                const callID = uuidv4();
                if (userCallStatus.get(data.data.receiverID)) {
                    io.to(socket.id).emit('call_busy', {
                        message: 'User is on another call'
                    });

                    const callDTO = new CallsDTO(
                        callID,
                        userID,
                        data.data.receiverID,
                        data.data.callername,
                        data.data.receivername,
                        data.data.roomID,
                        "busy",
                        data.data.calltype,
                        0
                    );

                    const callData = await callService.addCall(callDTO);

                    return callData;
                }

                userCallStatus.set(userID, true);
                userCallStatus.set(receiverID, true);

                if (receiverSocketID) {
                    const callPacket = {
                        from: userID,
                        callID: callID,
                        username: data.data.callername,
                        offer: data.data.offer
                    }

                    io.to(receiverSocketID).emit('incomming_call', callPacket);

                    const timeout = setTimeout(async () => {
                        socket.emit('call_timeout', {
                            message: 'Call unanswered'
                        });
                        io.to(receiverSocketID).emit('call_timeout', {
                            message: 'Missed call'
                        });

                        const callDTO = new CallsDTO(
                            callID,
                            userID,
                            data.data.receiverID,
                            data.data.roomID,
                            data.data.callername,
                            data.data.receivername,
                            "missed",
                            data.data.calltype,
                            0
                        );

                        await callService.addCall(callDTO);

                        userCallStatus.delete(userID);
                        userCallStatus.delete(receiverID);
                        callTimeOutMap.delete(receiverID);
                    }, 30000);

                    callTimeOutMap.set(receiverID, timeout);
                }
            } catch (err) {
                console.error('Error in calling user: ', err);
            }
        });

        socket.on('answer_call', async (data) => {
            try {
                const targetID = data.data.targetID;
                const targetSocketID = userSocketMap.get(targetID);

                if (targetSocketID) {
                    io.to(targetSocketID).emit('call_answered', {
                        answer: data.data.answer,
                        callID: data.data.callID
                    });

                    const callDTO = new CallsDTO(
                        data.data.callID,
                        targetID,
                        userID,
                        data.data.callername,
                        data.data.receivername,
                        "answered",
                        data.data.calltype,
                        0
                    );

                    await callService.addCall(callDTO);

                    const timeout = callTimeOutMap.get(userID);

                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    callTimeOutMap.delete(userID);
                }
            } catch (err) {
                console.error('Error in answering call: ', err);
            }
        });

        socket.on('decline_call', async (data) => {
            try {
                const targetID = data.data.targetID;
                const targetSocketID = userSocketMap.get(targetID);

                if (targetSocketID) {
                    io.to(targetSocketID).emit('call_declined', {
                        message: 'Call declined'
                    });

                    const callDTO = new CallsDTO(
                        data.data.callID,
                        targetID,
                        userID,
                        data.data.callername,
                        data.data.receivername,
                        data.data.roomID,
                        "declined",
                        data.data.calltype,
                        0
                    );

                    await callService.addCall(callDTO);
                }

                userCallStatus.delete(userID);
                userCallStatus.delete(data.data.targetID);

                const timeout = callTimeOutMap.get(userID);
                if (timeout) clearTimeout(timeout);
                callTimeOutMap.delete(userID);
            } catch (err) {
                console.error('Error in declining call: ', err);
            }
        });

        socket.on('ice_exchange', async (data) => {
            try {
                const targetID = data.data.targetID;
                const targetSocketID = userSocketMap.get(targetID);

                if (targetSocketID) {
                    io.to(targetSocketID).emit('ice_candidate', {
                        candidate: data.data.candidate
                    });
                }
            } catch (err) {
                console.error('Error in exchanging ice: ', err);
            }
        });

        socket.on('end_call', async (data) => {
            try {
                const targetID = data.data.targetID;
                const targetSocketID = userSocketMap.get(targetID)

                if (targetSocketID) {
                    io.to(targetSocketID).emit('call_ended', {
                        ended: data.data.ended
                    });

                    const callDTO = new CallsDTO(
                        data.data.callID,
                        userID,
                        targetID,
                        data.data.callername,
                        data.data.receivername,
                        data.data.roomID,
                        "answered",
                        data.data.calltype,
                        data.data.duration
                    );

                    await callService.updateCall(callDTO);
                }

                userCallStatus.delete(userID);
                userCallStatus.delete(data.data.targetID);
                const timeout = callTimeOutMap.get(userID);

                if (timeout) {
                    clearTimeout(timeout);
                }

                callTimeOutMap.delete(userID);
            } catch (err) {
                console.error("Error in ending call: ", err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            userCallStatus.delete(userID);
            const timeout = callTimeOutMap.get(userID);
            if (timeout) clearTimeout(timeout);
            callTimeOutMap.delete(userID);
        });
    });
}

export { initializeChatSocket, initializeCallSocket };