import express from "express";
import RestaurantController from './restaurants.controller.js'

//Get access to express Router
const router = express.Router();

//Create routes
router.route("/").get(RestaurantController.apiGetRestaurants); //Root url
router.route("/")

export default router;
