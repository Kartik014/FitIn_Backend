import authenticateSocketToken from "../middlewares/authenticateSocketToken.js";
import { initializeChatSocket } from "../sockets/sockets.js";

const chatSocketRoute = (io) => {
    const socket = io.of('/chat')
    socket.use(authenticateSocketToken)
    initializeChatSocket(socket);
}

export { chatSocketRoute };