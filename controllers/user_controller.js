import { nanoid } from "nanoid";
import UserDTO from "../DTO/userDTO.js";
import userService from "../service/user_service.js";

const createUser = async (req, res) => {
    try {

        const userID = nanoid(8);

        const userDTO = new UserDTO(
            userID,
            req.body.username,
            req.body.password,
            req.body.role,
            req.body.mobileNumber,
            req.body.gender,
            req.body.dob,
            req.body.email,
        )

        const newUser = await userService.addUser(userDTO);

        res.status(200).json({
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {

        console.error('Error in getUserById controller:', error);
        res.status(404).json({
            message: 'User not found',
            error: error.message
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

        res.status(200).json({
            message: 'LogIn successful',
            user: existingUser
        });

    } catch (err) {

        console.error('Error in getUser controller:', err);
        res.status(404).json({
            message: 'User not found',
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
            req.mobileNumber || null,
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
        res.status(404).json({
            message: 'User not found',
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

        res.status(404).json({
            message: "User not found",
            error: err.message
        });

    }
}

export { createUser, getUser, updateUser, logoutUser };