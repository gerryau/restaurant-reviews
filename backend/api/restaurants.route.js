import express from "express";
import RestaurantsController from "./restaurants.controller.js";
import ReviewsController from "./reviews.controller.js";

//Get access to express Router
const router = express.Router();

//Create routes
router.route("/").get(RestaurantsController.apiGetRestaurants);
router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById);
router.route("/cuisines").get(RestaurantsController.apiGetRestaurantCuisines); //gets list of all cuisines

router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview);

export default router;
