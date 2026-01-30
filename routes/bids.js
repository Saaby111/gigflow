const express = require("express");
const router = express.Router();
const bidController = require("../controllers/bidController");
const { protect } = require("../middleware/auth");

router.get("/my-bids", protect, bidController.getMyBids);

router.get("/assigned", protect, bidController.getAssignedGigs);

router.get("/gig/:gigId", protect, bidController.getBidsByGig);

router.post("/", protect, bidController.createBid);

router.patch("/:bidId/hire", protect, bidController.hireFreelancer);

module.exports = router;
