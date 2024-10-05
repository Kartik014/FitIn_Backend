class OtpDTO {
    constructor(otp = null, expirationTime = null, userId, type, isVerified = false) {
        this.otp = otp;
        this.expirationTime = expirationTime;
        this.userId = userId;
        this.type = type;
        this.isVerified = isVerified;
    }
}

export default OtpDTO;
