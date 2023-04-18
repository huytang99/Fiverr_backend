import express from "express";
import { logTest } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/", logTest);

export default router;