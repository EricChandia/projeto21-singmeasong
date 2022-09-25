import { Router } from "express";
import { reset } from "../controllers/testsController.js"
 

const testsRouter = Router();

testsRouter.post("/tests/reset", reset);

export default testsRouter;