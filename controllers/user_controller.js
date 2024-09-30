import UserDTO from "../DTO/userDTO.js";
import userService from "../service/user_service.js";

const createUser = async (req, res) => {
    try {
        
        const userDTO = new UserDTO(
            req.body.id,
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.role,
            req.body.mobileNumber,
            req.body.gender,
            req.body.dob
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

export default createUser;