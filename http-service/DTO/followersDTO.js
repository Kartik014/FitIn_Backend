class FollowerDTO {
    constructor(id, followerid = null, followedbyid = null, requeststatus = 0) {
        this.id = id;
        this.followerid = followerid;
        this.followedbyid = followedbyid;
        this.requeststatus = this.validateRequestStatus(requeststatus);
    }

    validateRequestStatus(requeststatus) {
        const allowedStatus = [0, 1, 2];
        if (!allowedStatus.includes(requeststatus)) {
            throw new Error(`Invalid request status: ${requeststatus}. Allowed request status are 0 or 1 or 2.`);
        }
        return requeststatus;
    }

}

export default FollowerDTO;