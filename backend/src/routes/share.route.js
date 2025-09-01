import express from "express";
import { shareFileWithEmail, generateSharableLink, getSharedFile, getSharedWithMe } from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyJWT);

router.get("/files", getSharedWithMe);
router.post("/email", shareFileWithEmail);
router.post("/link", generateSharableLink);
router.get("/:token", getSharedFile);

export default router;
