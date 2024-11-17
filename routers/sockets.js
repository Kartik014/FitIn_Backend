import authenticateSocketToken from "../middlewares/authenticateSocketToken.js";
import { initializeCallSocket, initializeChatSocket } from "../sockets/sockets.js";

const chatSocketRoute = (io) => {
    const socket = io.of('/chat')
    socket.use(authenticateSocketToken)
    initializeChatSocket(socket);
}

const callSocketRoute = (io) => {
    const socket = io.of('/call')
    socket.use(authenticateSocketToken)
    initializeCallSocket(socket);
}

export { chatSocketRoute, callSocketRoute };