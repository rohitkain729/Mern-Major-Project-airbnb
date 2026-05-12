const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 

main()
  .then(() => {
    console.log("connect to DB");
  })
  .catch((err) => {
    console.log("ERROR IN DB CONNECTION" + err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async (req, res) => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data is inititalized");
};

// initDB();
