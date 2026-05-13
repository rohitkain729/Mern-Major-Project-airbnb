const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./SchemaValidate/schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// app.use("/api",(req,res,next)=>{
//  let token = req.query;
//  if(token=="giveaccess"){
//   next();
//  }else{
//   res.send("access denied");
//  }
// });

// app.use("/api/:token", (req, res) => {
//   let {token}=req.params;
//   if(token==="giveaccess"){
//     return res.send("access authorized");
//   }else{
//     return res.send("access unauthorized");
//   }

// });

// app.use("/api",(req,res)=>{

//   let {token} = req.query;

//   if(token==="giveaccess"){
//     return res.send("access authorized");
//   }else{
//     return res.send("access unauthorized");
//   }

// });

// const checkToken=(req,res)=>{

//   let {token} = req.query;

//   if(token==="giveaccess"){
//     return res.send("access authorized");
//   }else{
//      throw new Error("access unauthorized");
//   }

// };

// app.use("/err", (req, res) => {
//   abc = abc;
//   // res.send("data");
// });

// app.use((err, req, res, next) => {
//   console.log("-------------error----------");
//   next(err);
// });

// app.use("/api",(req, res, next) => {
//   console.log("middle ware 1");
//   next();
// });

// app.use(() => {
//   console.log("middle ware 2");
// });



app.get("/", (req, res) => {
  res.send("hi i am root");
});




app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

// handle error middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Internal Server Error" } = err;
  console.log(err);
  res.render("error.ejs", { status, message });
  // res.status(statusCode).send(message);
  // res.send("ERROR OCCURED!");
});

app.listen(8080, () => {
  console.log("server is listening to 8080");
});
