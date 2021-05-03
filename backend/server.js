import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

//Create our app
const app = express();

//Apply middleware
app.use(cors());
//Allows server to accept & read json in the body of the request
app.use(express.json());

//Initial routes, general procedure is /api/{version#}/{resource}
app.use("/api/v1/restaurants", restaurants);
//In the event a user goes to a route that doens't exist
app.use("*", (req,res) => res.status(404).json({error:"not found"}));

//export 'app' as a module
export default app