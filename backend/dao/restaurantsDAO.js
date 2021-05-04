import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

//We use this variable to store a reference to our database collection
let restaurants;

//DAO = Document Access Object
export default class RestauarantsDAO {
  //Initially connect to our database
  //Call this as soon as our server starts giving us a reference to our restaurants db
  static async injectDB(connection) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await connection
        .db(process.env.REST_REVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in restaurantDAO: ${e}`
      );
    }
  }

  //Function to enable us to sort, get page# and how many do you need
  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    //query will be empty unless we are passed a filter
    let query;
    if (filters) {
      //https://docs.mongodb.com/manual/reference/operator/
      if ("name" in filters) {
        //For mongoDb to know which field to search ($text $search) needs to be setup up in mongoDb Atlas
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);
      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  static async getRestaurantByID(id) {
    try {
      //using mongo aggregation pipeline to get restaurant and its reviews
      //https://docs.mongodb.com/manual/reference/operator/
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$restaurant_id", "$$id"] },
                },
              },
              { $sort: { date: -1 } },
            ],
            as: "reviews", //set as reviews
          },
        },
        {
          $addFields: { reviews: "$reviews" },
        },
      ];
      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`);
      throw e;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
