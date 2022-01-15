// const expressSession = require("express-session");
// const User = require("./models/User");


// exports.list = async (req, res) => {
//     const message = req.query.message;

//     // Find User
//     const user = User.findById(req.session.userID);
//     if (!user) {
//         res.render("home", {message: "Login to get started"});
//     }
// }