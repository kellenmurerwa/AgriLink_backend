import express from "express";
import { Register, Login,getAllUsers} from "../Controllers/userController.js";

const userRouter = express.Router();

// User registration route
userRouter.post("/register", Register);  

// User login route
userRouter.post("/login", Login);  

//user getAll
userRouter.get("/list",getAllUsers)

export default userRouter;
