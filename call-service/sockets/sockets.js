import { v4 as uuidv4 } from "uuid";
import callService from "../service/call/call_service.js";
import CallsDTO from "../DTO/callsDTO.js";

const userSocketMap = new Map();
const userCallStatus = new Map();
const callTimeOutMap = new Map();

function initializeCallSocket(io) {
    io.on('connection', async (socket) => {
        const userID = socket.user.id;
        userSocketMap.set(userID, socket.id);

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
            userSocketMap.delete(userID);
        });
    });
}

export { initializeCallSocket };