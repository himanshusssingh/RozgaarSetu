import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  registerForm,
  loginForm,
  editProfile,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").get(registerForm).post(registerUser);
router.route("/login").get(loginForm).post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);
router.route("/updatePassword").post(verifyJWT, updatePassword);
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser);
router
  .route("/updateDetails")
  .get(editProfile)
  .post(verifyJWT, updateAccountDetails);

export default router;
