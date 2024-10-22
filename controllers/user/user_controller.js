import { nanoid } from "nanoid";
import UserDTO from "../../DTO/userDTO.js";
import userService from "../../service/user/user_service.js";
import otpService from "../../service/otp/otp_service.js";
import OtpDTO from "../../DTO/otpDTO.js";

const createUser = async (req, res) => {
    try {

        const userID = nanoid(8);

        const userDTO = new UserDTO(
            userID,
            req.body.username,
            req.body.password,
            req.body.role,
            req.body.mobilenumber,
            req.body.gender,
            req.body.dob,
            req.body.email,
        )

        const newUser = await userService.addUser(userDTO);

        const otpDTO = new OtpDTO(
            null,
            null,
            newUser.id,
            "new_account",
            false
        )

        const otp = await otpService.addOtp(otpDTO);

        res.status(200).json({
            message: 'User created successfully',
            user: newUser,
            otp: otp
        });

    } catch (error) {

        console.error('Error in getUserById controller:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const getUser = async (req, res) => {
    try {

        const userDTO = new UserDTO(
            null,
            req.body.username || null,
            req.body.password,
            req.body.role,
            null,
            null,
            req.body.email || null,
            null
        )

        const existingUser = await userService.getUser(userDTO);

        const otpDTO = new OtpDTO(
            null,
            null,
            existingUser.id,
            "new_account"
        )

        const isOtpVerified = await otpService.isOtpVerified(otpDTO);

        if (isOtpVerified) {

            res.status(200).json({
                message: 'LogIn successfull',
                user: existingUser
            });
            
        } else {

            res.status(200).json({
                message: 'OTP not verified',
                user: existingUser
            });

        }

    } catch (err) {

        console.error('Error in getUser controller:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const updateUser = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const updateUser = new UserDTO(
            id,
            req.username || null,
            req.password || null,
            role,
            req.mobilenumber || null,
            req.gender || null,
            req.dob || null,
            email,
            req.headers.authorization?.split(' ')[1]
        )

        const updateProfile = await userService.updateUser(updateUser);

        res.status(200).json({
            message: 'Profile updated',
            user: updateProfile
        });

    } catch (err) {

        console.error('Error in updateUser controller:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const logoutUser = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const existingUser = new UserDTO(
            id,
            null,
            null,
            role,
            null,
            null,
            null,
            email,
            req.headers.authorization?.split(' ')[1]
        )

        const logout = await userService.logoutUser(existingUser);

        res.status(200).json({
            message: "Logout Successful",
            user: logout
        });

    } catch (err) {

        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const deleteUser = async (req, res) => {
    try {
        const { id, email, role } = req.user;

        const existingUser = new UserDTO(
            id,
            null,
            null,
            role,
            null,
            null,
            null,
            email,
            req.headers.authorization?.split(' ')[1]
        )

        const deleteUser = await userService.deleteUser(existingUser);

        res.status(200).json({
            message: "Account deleted successfully",
            user: deleteUser
        });

    } catch (err) {

        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const getUserNamesAndEmails = async (req, res) => {
    try {

        const userEmailsAndUsernames = await userService.getAllUserEmailsAndUsernames();

        res.status(200).json({
            message: 'Fetched all emails and usernames successfully',
            data: userEmailsAndUsernames
        });

    } catch (err) {

        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

export { createUser, getUser, updateUser, logoutUser, deleteUser, getUserNamesAndEmails };