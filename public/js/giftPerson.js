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
    var userCircleData = {
      name: nameInput.val().trim(),
      age: ageInput.val().trim(),
      interests: interestsInput.val().trim(),
      budget: priceInput.val().trim(),
      id: hiddenId.val().trim()
    };

    if (!userCircleData.memberName || !userCircleData.name)  {
      return;
    }
    // If we have an email and password, run the signUpUser function
    addGiftPerson(userCircleData.name, userCircleData.age, userCircleData.interests, userCircleData.budget, userCircleData.id);
    nameInput.val("");
    ageInput.val("");
    priceInput.val("");
    interests.val("");
    hiddenId.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function addGiftPerson(email, password) {
    $.post("/api/addPerson", {
      name: name,
      age: age,
      interests : interests,
      budget: budget,
      userid: id
    })
      .then(function(data) {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
