import { Router } from "express";
import { generateCombinations } from "./combination-generator.controller.js";
import { validateRequestFormat } from "./middleware/validateRequestFormat.js";

const router = Router();

router.post("/", validateRequestFormat, generateCombinations);

export default router;
