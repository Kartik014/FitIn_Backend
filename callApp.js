import express from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import { callSocketRoute } from "./routers/sockets.js";
import { Server } from "socket.io";

const callApp = express();

callApp.use(express.json());
callApp.use(cors());
callApp.use(helmet());
callApp.use(xssClean());
callApp.use(
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

const initializeCallServer = (callServer) => {
    const callIO = new Server(callServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    callSocketRoute(callIO);
};

export { callApp, initializeCallServer };
