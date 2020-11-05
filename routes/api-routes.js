// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Get all gifts from the table
  app.get("/api/getAllPersons/:id", function (req, res) {
    db.UserCircle.findAll({
      where: {
        userid: req.params.id
      }
    }).then(function (results) {
      res.json(results);
    });
  });


  // Get all gifts from the table
  app.get("/api/getOnePerson/:id", function (req, res) {
    db.UserCircle.findAll({
      where: {
        id: req.params.id
      }
    }).then(function (results) {
      res.json(results);
    });
  });


  //Route for adding userCirlce details to the table
  app.post("/api/addPerson", function (req, res) {
    db.UserCircle.create({
      name: req.body.name,
      age: parseInt(req.body.age),
      keywords: req.body.interests,
      budget: parseInt(req.body.budget),
      UserId: req.body.userid
    })
      .then(function (results) {
        res.json(results);
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  //Route for adding userCirlce details to the table
  app.post("/api/saveFavGift", function (req, res) {
    db.ItemStorage.create({
      name: req.body.name,
      price: parseInt(req.body.price),
      keywords: req.body.interests,
      href: req.body.href
    })
      .then(function (results) {
        res.json(results);
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });


  // Get all gifts from the table
  app.get("/api/giftSearch/:srchItem", function (req, res) {
    db.ItemStorage.findAll({
      where: {
        keywords: req.params.srchItem
      }
    }).then(function (results) {
      res.json(results);
    });
  });

  // Get all gifts from the table
  app.get("/api/matchInterest/:budget/:keywords", function (req, res) {
    db.ItemStorage.findAll({
      where: {
        [Op.and]: [
          { price: { [Op.lt]: req.params.budget } },
          { keywords: { [Op.substring]: req.params.keywords } }
        ]
      }
    }).then(function (results) {
      res.json(results);
    });
  });


  //Route for adding userCirlce details to the table
  app.post("/api/addPersonGift", function (req, res) {
    db.Gift.create({
      name: req.body.name,
      price: parseInt(req.body.price),
      href: req.body.href,
      UserCircleId: req.body.UserCircleId
    })
      .then(function (results) {
        res.json(results);
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });


  // Get all gifts from the table
  app.get("/api/dispChosenGifts/:id", function (req, res) {
    db.Gift.findAll({
      where: {
        UserCircleId: req.params.id
      }
    }).then(function (results) {
      res.json(results);
    });
  });

  // Get all gifts from the table
  app.get("/api/allItemStorage", function (req, res) {
    db.ItemStorage.findAll().then(function (results) {
      res.json(results);
    });
  });

  app.delete("/api/delPersonGift/:UserCircleId/:giftId", function (req, res) {
    let saveUserCircleId = req.params.UserCircleId;
    db.Gift.destroy({
      where: {
        UserCircleId: req.params.UserCircleId,
        id: req.params.giftId
      }
    }).then(function (response) {
      console.log("Deleted Successfully", saveUserCircleId);
      res.json(response);
    })
  });

  app.delete("/api/delPerson/:id/:userid", function (req, res) {
    db.UserCircle.destroy({
      where: {
        id: req.params.id,
        UserId: req.params.userid
      }
    }).then(function (response) {
      res.json(response);
    }).catch(function (err) {
      res.status(401).json(err);
    })
  });


  app.get("/api/getTotalCost/:id", function (req, res) {
    db.Gift.findAll({
      attributes: ['UserCircleId',
        [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
        [Sequelize.fn('count', Sequelize.col('id')), 'total_gifts'],
      ],
      group: ['UserCircleId']
      //having: [Sequelize.where(Sequelize.fn([Op.eq],Sequelize.col('UserCircleId'),parseInt(req.params.id)))]
    }).then(function (results) {
      res.json(results);
    });
  });


};
