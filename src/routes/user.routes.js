import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  registerUser
);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/updatePassword").post(verifyJWT, updatePassword);
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser);
router.route("/updateDetails").post(verifyJWT, updateAccountDetails);


export default router;
