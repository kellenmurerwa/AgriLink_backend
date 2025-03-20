import express from "express";
import { Register, Login } from "../Controllers/userController.js";

const userRouter = express.Router();

// User registration route
userRouter.post("/register", Register);  

// User login route
userRouter.post("/login", Login);  

export default userRouter;
