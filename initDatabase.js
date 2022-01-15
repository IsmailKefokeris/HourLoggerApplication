const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI, MONGODB_PRODUCTION_URI } = process.env;


// MongoDB Client
const client = new MongoClient(
    process.env.NODE_ENV === "production" ? MONGODB_PRODUCTION_URI : MONGODB_URI
);


async function main() {
    try{
        await client.connect();
        const db = client.db("hourLogger");
        const result = await db.collection("job").find({}).count();


        // If existing records then delete the current collections
        if (results) {
            db.dropDatabase();
        }

        const load = loading("Setting up Database").start();

        



        load.stop();
        console.info(
            "Database set up!"
        );


        process.exit();
    } catch (e) {
        console.error("ERROR OCCURED: " + e);
        process.exit();
    }
}

main();






