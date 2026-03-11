import express from "express";
import { addAddress } from "../controllers/address.controller.js";
import { auth } from "../middlewares/auth.middlewares.js";
import { fetchAddresses } from "../controllers/address.controller.js";

const router = express.Router();

router.post("/add", auth, addAddress);
router.get("/", auth, fetchAddresses);

export default router;