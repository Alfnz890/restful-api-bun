import { Hono } from "hono";
import { UserController } from "../controllers/user.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controllers";

const route = new Hono();

route.get('/users', authMiddleware, UserController.getAllUser);
route.get('/users/:id', authMiddleware, UserController.getUserById);
route.post('/users', UserController.register);
route.patch('/users/:id', authMiddleware, UserController.updateUser);
route.delete('/users/:id', authMiddleware, UserController.deleteUser);

// Authentication
route.post('/login', AuthController.login);
route.delete('/logout', authMiddleware, AuthController.logout);

export default route