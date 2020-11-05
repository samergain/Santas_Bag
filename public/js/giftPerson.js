$(document).ready(function() {
  // Getting references to our form and input
  var addPersonForm = $("form.addPerson");
  var userId;
  var emailInput = $("input#email-input");


  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;
    // findPersons(userId);
    $(".hiddenId").text(data.id);
  });


  // When the signup button is clicked, we validate the email and password are not blank
  addPersonForm.on("submit", function(event) {
    event.preventDefault();
    console.log("search form submit working");
    var userId = parseInt($(".hiddenId").text());
    var userCircleData = {
      name : $("#nameInput").val().trim(),
      age: $("#ageInput").val().trim(),
      interests: $("#interestsInput").val().trim(),
      budget: $("#priceInput").val().trim(),
      userid: userId
    };

    if (!userCircleData.name)  {
      return;
    }


    // If we have an email and password, run the signUpUser function
    addGiftPerson(userCircleData.name, userCircleData.age, userCircleData.interests, userCircleData.budget, userCircleData.userid);
    $("#nameInput").val("");
    $("#ageInput").val("");
    $("#priceInput").val("");
    $("#interestsInput").val("");

  });


  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function addGiftPerson(name, age, interests, budget, userid) {
    console.log("function addGiftPerson called");
    $.post("/api/addPerson", {
      name: name,
      age: age,
      budget: budget,
      interests: interests,
      userid: userid
    })
      .then(function(data) {
        console.log("addedGiftPErson", data);
        //alert("New Gift Person Added Successfully!");
        $("#alert .msg").text("New Gift Person Added Successfully!");
        window.location.replace("/giftSearch.html?id=" + data.id);
      })
      .catch(handleLoginErr);
  }
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});