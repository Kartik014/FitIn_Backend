import jwtService from "../jwtservice/jwt.js";

const authenticateSocketToken = (socket, next) => {
    const token = socket.handshake.headers['authorization'].split(' ')[1];

    if (!token) {
        console.error('Authorization token missing');
        return next(new Error('Authorization token missing'));
    }

    const { valid, decodedToken, error } = jwtService.validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: error });
    }

    socket.user = decodedToken;

    next();

}

export default authenticateSocketToken;