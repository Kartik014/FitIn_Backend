import user from "../../database/models/user/user.js";
import UserDTO from "../../DTO/userDTO.js";
import * as bcrypt from "bcrypt";
import jwtService from "../../jwtservice/jwt.js";

const userService = {
    addUser: async (userDTO) => {
        try {

            const userExist = await user.getUserbyEmailOrUsername(userDTO);
            if (userExist) {
                return { newUser: userDTO, user_exist: true };
            }

            const hashedPassword = await bcrypt.hash(userDTO.password, 10);
            const newUser = new UserDTO(
                userDTO.id,
                userDTO.username,
                hashedPassword,
                userDTO.role,
                userDTO.mobilenumber,
                userDTO.gender,
                userDTO.dob,
                userDTO.email
            )

            const createUser = await user.addUser(newUser);
            return { newUser: createUser, user_exist: false };

        } catch (err) {

            console.error('Error in addUser service: ', err);
            throw err;

        }
    },

    getUser: async (userDTO) => {
        try {

            const userExist = await user.getUserbyEmailOrUsername(userDTO);
            if (!userExist) {
                // throw new Error('User not found');
                return { existingUser: userExist, credentials: false };
            } else {
                const comparePassword = await bcrypt.compare(userDTO.password, userExist.password);
                
                if (comparePassword) {
                    const session = jwtService.generateToken(userExist);
                    userExist.session = session;
                    const updatedSession = await user.updateUserLogIn(userExist);
                    return { existingUser: updatedSession, credentials: true };
                } else {
                    // throw new Error('Invalid credentials');
                    return { existingUser: userExist, credentials: false };
                }

            }

        } catch (err) {

            console.error('Error in getUser service: ', err);
            throw err;

        }
    },

    updateUser: async (userDTO) => {
        try {

            const updatedProfile = await user.updateUserProfile(userDTO);
            return updatedProfile;

        } catch (err) {

            console.error('Error in updateUser service: ', err);
            throw err;

        }
    },

    logoutUser: async (userDTO) => {
        try {

            const logout = await user.logoutUser(userDTO);
            return logout;

        } catch (err) {

            console.error('Error in logoutUser service: ', err);
            throw err;

        }
    },

    deleteUser: async (userDTO) => {
        try {

            const deleteUser = await user.deleteUser(userDTO);
            return deleteUser;

        } catch (err) {

            console.error('Error in deleteUser service: ', err);
            throw err;

        }
    },

    getAllUserEmailsAndUsernames: async () => {
        try {
            const userEmailsAndUsernames = await user.getAllUserEmailsAndUsernames();
            return userEmailsAndUsernames;
        } catch (err) {
            console.error('Error in getAllUserEmailsAndUsernames service: ', err);
            throw err;
        }
    }
}

export default userService;