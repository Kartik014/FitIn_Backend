import jwtService from "../jwtservice/jwt.js";

const authenticateToken = (req, res, next) => {
    let token = null;
    if (req.headers['authorization'] != null && req.headers['authorization'] != "") {
        token = req.headers['authorization'].split(' ')[1];
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

    req.user = decodedToken;

    next();

}

export default authenticateToken;