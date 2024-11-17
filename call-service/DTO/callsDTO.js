class CallsDTO {
    constructor(callid, callerID, receiverID, callername, receivername, roomID, status, calltype, duration) {
        this.callid = callid;
        this.callerID = callerID;
        this.receiverID = receiverID;
        this.callername = callername;
        this.receivername = receivername;
        this.roomID = roomID;
        this.status = this.validateStatus(status);
        this.caltype = this.validateCallType(calltype);
        this.duration = duration;
    }

    validateStatus(status) {
        const validStatuses = ["declined", "missed", "answered", "busy"];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Allowed values are: ${validStatuses.join(", ")}`);
        }
        return status.toLowerCase();
    }

    validateCallType(calltype) {
        const validCallTypes = ["video", "auido"];
        if (!validCallTypes.includes(calltype)) {
            throw new Error(`Invalid call type. Allowed values are: ${validCallTypes.join(", ")}`);
        }
        return calltype.toLowerCase();
    }
}

export default CallsDTO;