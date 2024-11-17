import express from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import { Server } from "socket.io";
import { chatSocketRoute } from "./routers/sockets.js";

const chatApp = express();

chatApp.use(express.json());
chatApp.use(cors());
chatApp.use(helmet());
chatApp.use(xssClean());
chatApp.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'strict-dynamic'"],
            styleSrc: ["'self'", "trusted-styles.com", "'sha256-<your-hash>'"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
            blockAllMixedContent: [],
        },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: "same-origin",
        referrerPolicy: { policy: "no-referrer" },
        dnsPrefetchControl: { allow: false },
        frameguard: { action: "deny" },
        hidePoweredBy: true,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        ieNoOpen: true,
        noSniff: true,
        xssFilter: true,
    })
);

const initializeChatServer = (chatServer) => {
    const chatIO = new Server(chatServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    chatSocketRoute(chatIO);
};

export { chatApp, initializeChatServer };
