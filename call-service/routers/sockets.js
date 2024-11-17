import authenticateSocketToken from "../middlewares/authenticateSocketToken.js";
import { initializeCallSocket } from "../sockets/sockets.js";

const callSocketRoute = (io) => {
    const socket = io.of('/call')
    socket.use(authenticateSocketToken)
    initializeCallSocket(socket);
}

export { callSocketRoute };