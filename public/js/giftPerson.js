$(document).ready(function() {
  // Getting references to our form and input
  var addPersonForm = $("form.addPerson");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    $(".hiddenId").val(data.id);
  });
  // When the signup button is clicked, we validate the email and password are not blank
  addPersonForm.on("submit", function(event) {
    event.preventDefault();
    console.log("search form submit working");
    var userCircleData = {
      name : $("#nameInput").val().trim(),
      age: $("#ageInput").val().trim(),
      interests: $("#interestsInput").val().trim(),
      budget: $("#priceInput").val().trim(),
      userid: $("#userId").val().trim()
    };

    if (!userCircleData.name)  {
      return;
    }
    // If we have an email and password, run the signUpUser function
    addGiftPerson(userCircleData.name, userCircleData.age, userCircleData.interests, userCircleData.budget, userCircleData.id);
    $("#nameInput").val("");
    $("#ageInput").val("");
    $("#priceInput").val("");
    $("#interests").val("");
    $("#userId").val("");
  });
  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function addGiftPerson(name, age, interests, budget, userid) {
    console.log("function addGiftPerson called");
    $.post("/api/addPerson", {
      name: name,
      age: age,
      budget: budget,
      userid: userid
    })
      .then(function(data) {
        console.log("addedGiftPErson", data);
        window.location.replace("/giftSearch");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});