import { Router } from 'express';
import {
    getAllJournal,
    publishAJournal,
    getJournalById,
    updateJournal,
    deleteJournal,
    getInsights,
    analyzeJournal
} from "../controllers/journal.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


router
    .route("/")
    .post(publishAJournal)
    .get(getAllJournal)

router
    .route("/:journalId")
    .get(getJournalById)
    .delete(deleteJournal)
    .patch(updateJournal)

router
    .route("/analyze")
    .post(analyzeJournal)

router
    .route("/insights/:userId")
    .get(getInsights)

export default router;