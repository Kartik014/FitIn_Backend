class OtpDTO {
    constructor(otp = null, expirationTime = null, userId, type, isVerified = false) {
        this.otp = otp;
        this.expirationTime = expirationTime;
        this.userId = userId;
        this.type = this.validateType(type);
        this.isVerified = isVerified;
    }

    validateType(type) {
        const allowedTypes = ['new_account', 'forgot_password', 'change_password'];
        if (!allowedTypes.includes(type.toLowerCase())) {
            throw new Error(`Invalid type. Allowed types are: ${allowedTypes.join(', ')}`);
        }

        return type.toLowerCase();
    }
}

export default OtpDTO;
