const expressSession = require("express-session");
const User = require("../../models/User");
const Job = require("../../models/Job");
const Tracker = require("../../models/Tracker");


exports.view = async (req, res) => {

    const id = req.query.id;

    // console.log(id);
    
    try {
        const trackers = await Tracker.aggregate([
            { $match: {job: id}}
        ]);
        if(trackers.length > 0){
            res.json(trackers);
        }else{
            res.json([])
        }
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}