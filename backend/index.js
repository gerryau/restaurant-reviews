import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

//NOTE: This file connects to our server

//Configure dotenv
dotenv.config();

//Get access to mongo client
const MongoClient = mongodb.MongoClient;

//Setup port from dotenv and default
const port = process.env.PORT || 8000;

//Connect to database
MongoClient.connect(
  process.env.RESTREVIEWS_DB_URI,
  //Pass in the options for accessing the database
  //Can be custom to project
  {
    //only allows 50 people access at a time
    poolSize: 50,
    //after 2500 miliseconds the request will timeout
    wtimeout: 2500,
    //added to work with new mongodb
    useNewUrlParser: true,
    //useUnifiedTopology: true,
  }
)
  .catch((error) => {
    console.error(error.stack);
    process.exit();
  })
  .then(async (client) => {
    //Call injectDB get initial collection
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    //Starting web server
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
