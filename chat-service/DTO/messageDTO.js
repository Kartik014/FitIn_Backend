class MessageDTO {
    constructor(roomID = null, senderID, receiverID, mid, body, isFile = "0", file = null, isForwarded = "0", isDeleted = "0") {
        this.roomID = roomID,
        this.senderID = senderID,
        this.receiverID = receiverID,
        this.mid = mid,
        this.body = body,
        this.isFile = isFile,
        this.file = file,
        this.isForwarded = isForwarded,
        this.isDeleted = isDeleted
    }

}

export default MessageDTO;