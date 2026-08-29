import { Router } from "express";
import ipoController from "../controllers/ipo";

const router = Router();

router.post("/create", ipoController.createIpoListing);
router.post("/action", ipoController.actionOnIpo);
export default router;
