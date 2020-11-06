$(document).ready(function() {
  // Getting references to our form and input
  var addPersonForm = $("form.addPerson");
  var userId;
  //Get the Logged-In User Data for further use
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;
    $(".hiddenId").text(data.id);
  });


  // Add Gift Person Button Click Event
  addPersonForm.on("submit", function(event) {
    event.preventDefault();
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
    // Calling Add Gift Person function where the AJAX call is made to insert a new Gift Person to the DB
    addGiftPerson(userCircleData.name, userCircleData.age, userCircleData.interests, userCircleData.budget, userCircleData.userid);
    $("#nameInput").val("");
    $("#ageInput").val("");
    $("#priceInput").val("");
    $("#interestsInput").val("");
  });


  // Add Gift Person API POST to submit the GIFT PERSON form entries to the server and save into the DB
  function addGiftPerson(name, age, interests, budget, userid) {
    $.post("/api/addPerson", {
      name: name,
      age: age,
      budget: budget,
      interests: interests,
      userid: userid
    })
      .then(function(data) {
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