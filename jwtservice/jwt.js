import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JSON_TOKEN_SECRET = process.env.SECRET_TOKEN;

const jwtService = {
    generateToken: (userDTO) => {
        const payload = {
            id: userDTO.id,
            email: userDTO.email,
            role: userDTO.role
        }
        return jwt.sign(payload, JSON_TOKEN_SECRET)
    },

    validateJwt: (session) => {
        try {
            const decodedToken = jwt.verify(session, JSON_TOKEN_SECRET);
            return {
                valid: true,
                decodedToken
            };
        } catch (err) {
            return {
                valid: false,
                error: 'Invalid or expired token'
            };
        }
    }
}

export default jwtService;