import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xssClean from "xss-clean";
import userRouter from "./routers/user.js";
import otpRouter from "./routers/otp.js";
import postRouter from "./routers/post.js";
import followersRouter from "./routers/followers.js";
import commentRouter from "./routers/comment.js";
import accountRouter from "./routers/account.js";
import plansRouter from "./routers/plans.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// app.set('trust proxy', true);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many request, Please try again later",
});

app.use(limiter);
app.use(xssClean());
app.use(
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

app.use("/user", userRouter);
app.use("/otp", otpRouter);
app.use("/post", postRouter);
app.use("/follow", followersRouter);
app.use("/comment", commentRouter);
app.use("/account", accountRouter);
app.use("/plans", plansRouter);

export default app;
