import calls from "../../database/models/calls/calls.js";
import redisClient from "../../redis/redisClient.js";

const callService = {
    addCall: async (callsDTO) => {
        const callDetails = null;
        if (callsDTO.status == "answered") {
            callDetails = {
                callid: callsDTO.callid,
                callerID: callsDTO.callerID,
                receiverID: callsDTO.receiverID,
                roomID: callsDTO.roomID,
                starttime: new Date().toISOString(),
                endtime: null,
                status: callsDTO.status,
                duration: callsDTO.duration || 0
            };
        } else if (callsDTO.status == "busy" || callsDTO.status == "missed" || callsDTO.status == "declined") {
            callDetails = {
                callid: callsDTO.callid,
                callerID: callsDTO.callerID,
                receiverID: callsDTO.receiverID,
                roomID: callsDTO.roomID,
                starttime: new Date().toISOString(),
                endtime: new Date().toISOString(),
                status: callsDTO.status,
                duration: callsDTO.duration || 0
            };
        }

        try {
            await redisClient.rpush(`calls:${callDetails.roomID}`, JSON.stringify(callDetails));
            console.log(`Call logged in Redis for roomID: ${callDetails.roomID}`);
        } catch (error) {
            console.error('Error logging call to Redis:', error);
            throw error;
        }

        return callDetails;
    },

    updateCall: async (callDTO) => {
        const callDetails = {
            callid: callDTO.callid,
            callerID: callDTO.callerID,
            receiverID: callDTO.receiverID,
            roomID: callDTO.roomID,
            endtime: new Date().toISOString(),
            status: callDTO.status,
        };

        try {
            const redisKey = `calls:${callDetails.roomID}`;
            const callsList = await redisClient.lrange(redisKey, 0, -1);

            let updatedCallDetails = null;

            for (let i = 0; i < callsList.length; i++) {
                const existingCall = JSON.parse(callsList[i]);

                if (existingCall.callid === callDetails.callid) {
                    const starttime = existingCall.starttime;
                    const start = new Date(starttime).getTime();
                    const end = new Date(callDetails.endtime).getTime();
                    const durationInSeconds = Math.floor((end - start) / 1000);
                    updatedCallDetails = {
                        ...existingCall,
                        endtime: callDetails.endtime,
                        status: callDetails.status,
                        duration: durationInSeconds,
                    };

                    await redisClient.lset(redisKey, i, JSON.stringify(updatedCallDetails));
                    console.log(`Call updated in Redis for callID: ${callDetails.callid} with duration: ${durationInSeconds}s`);
                    return updatedCallDetails;
                }
            }

            console.warn(`CallID ${callDetails.callid} not found in Redis for roomID: ${callDetails.roomID}`);
            return null;
        } catch (error) {
            console.error('Error updating call in Redis:', error);
            throw error;
        }
    },

    getCallHistory: async (roomID, limit = 10) => {
        try {
            const redisData = await redisClient.lrange(`calls:${roomID}`, -limit, -1);

            if (redisData.length > 0) {
                return redisData.map((call) => JSON.parse(call));
            }

            const callhistoryData = await calls.getCallHistory(roomID, limit);

            return callhistoryData;
        } catch (error) {
            console.error('Error fetching call history:', error);
            throw error;
        }
    }
}

export default callService;