import jwtService from "../jwtservice/jwt.js";

const authenticateSocketToken = (socket, next) => {
    let token = null;
    if (socket.handshake.headers['authorization'] != null || socket.handshake.headers['authorization'] != "") {
        token = socket.handshake.headers['authorization'].split(' ')[1];
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const { valid, decodedToken, error } = jwtService.validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: error });
    }

    socket.user = decodedToken;

    next();

}

export default authenticateSocketToken;