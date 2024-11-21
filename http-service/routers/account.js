import express from "express";
import xssClean from "xss-clean";
// import authenticateToken from "../middlewares/authenticateToken.js";
import upload from "../middlewares/multer.js";
import {
  createAccount,
  deleteAccount,
  editAccount,
  fetchAccount,
} from "../controllers/account/accountController.js";

const router = express.Router();

router.post("/addAccount", upload.single("profile"), createAccount);
router.get("/getAccount/:userid", fetchAccount);
router.put("/editAccount/:userid", upload.single("profile"), editAccount);
router.delete("/delete/:userid", deleteAccount);

export default router;
