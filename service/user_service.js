import user from "../database/models/user.js";
import UserDTO from "../DTO/userDTO.js";
import * as bcrypt from "bcrypt";

const userService = {
    addUser: async (userDTO) => {
        try {
            const hashedPassword = await bcrypt.hash(userDTO.password, 10);
            const newUser = new UserDTO(
                userDTO.id,
                userDTO.username,
                userDTO.email,
                hashedPassword,
                userDTO.role,
                userDTO.mobileNumber,
                userDTO.gender,
                userDTO.dob
            )
            const createUser = await user.addUser(newUser);
            return createUser;
        } catch (err) {
            console.error('Error in addUser service: ', err);
            throw err;
        }
    }
}

export default userService;