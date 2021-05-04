import express from "express";
import RestaurantsController from "./restaurants.controller.js";
import ReviewsController from "./reviews.controller.js";

//Get access to express Router
const router = express.Router();

//Create routes
router.route("/").get(RestaurantsController.apiGetRestaurants); //Root url

router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview);

export default router;
