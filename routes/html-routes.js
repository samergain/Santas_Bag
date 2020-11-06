// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the first page they will be take to, to view the summary of their Gift Person and their details
    if (req.user) {
      res.redirect("viewPerson");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the first page they will be take to, to view the summary of their Gift Person and their details
    if (req.user) {
      res.redirect("/viewPerson");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // Once logged-in, this will be the first page they will be take to, to view the summary of their Gift Person and their details
  app.get("/viewPerson", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/viewPerson.html"));
  });


  // HTML route to Add a New Gift PErson details and attach to the Logged in User account 
  app.get("/giftPerson", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/giftPerson.html"));
  });

  //html route for Save Favourote Gift Page
  app.get("/saveFavs", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/saveFavs.html"));
  });

};
