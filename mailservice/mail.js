import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

const mailService = {
    sendVerificationEmail: async (email, username, otp) => {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify your account',
            text: `Hello ${username},\n\nYour One-Time Password (OTP) for account verification is: **${otp}**\n\nPlease enter this OTP in the application to verify your account.\n\nThank you!`,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    },
};

export default mailService;