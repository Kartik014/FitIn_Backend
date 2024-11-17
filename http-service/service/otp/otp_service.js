import crypto from "crypto";
import otp from "../../database/models/otp/otp.js";

function generateOTP() {
    const otp = crypto.randomInt(100000, 999999);
    return otp.toString();
}

const otpService = {
    addOtp: async (otpDTO) => {
        try {

            const otpCode = generateOTP();
            const expiration_time = new Date(Date.now() + 10 * 60000);

            otpDTO.otp = otpCode;
            otpDTO.expirationTime = expiration_time;

            const generatedOTp = await otp.addOtp(otpDTO);
            return generatedOTp;

        } catch (err) {

            console.error('Error in addOtp service: ', err);
            throw err;

        }
    },

    verifyOtp: async (otpDTO) => {
        try {

            const verifiedOtp = await otp.verifyOtp(otpDTO);
            return verifiedOtp;

        } catch (err) {

            console.error('Error in verifyOtp service: ', err);
            throw err;

        }
    },

    isOtpVerified: async (otpDTO) => {
        try {

            const isVerified = await otp.isOtpVerified(otpDTO);
            return isVerified;

        } catch (err) {

            console.error('Error in isOtpVerified: ', err);
            throw err;

        }
    }
}

export default otpService;