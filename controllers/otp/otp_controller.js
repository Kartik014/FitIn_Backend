import OtpDTO from "../../DTO/otpDTO.js";
import otpService from "../../service/otp/otp_service.js";

const createOtp = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const otpDTO = new OtpDTO(
            null,
            null,
            id,
            req.body.type,
            false
        )

        const generatedOTP = await otpService.addOtp(otpDTO);

        res.status(200).json({
            message: 'OTP generated successfully',
            otp: generatedOTP
        });

    } catch (err) {

        console.error('Error in createOto controller:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const verifyOtp = async (req, res) => {
    try {

        const otpDTO = new OtpDTO(
            req.body.otp,
            null,
            req.body.id,
            req.body.type,
            false
        )

        const otpVerfied = await otpService.verifyOtp(otpDTO);

        res.status(200).json({
            message: 'OTP verified successfully',
            otp: otpVerfied
        });

    } catch (err) {

        console.error('Error in verifyOtp controller:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

export { createOtp, verifyOtp };