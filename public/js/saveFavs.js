$(document).ready(function() {
  // Getting references to our form and input
  var saveFavs = $("form.saveFavs");
  var userId;


  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;  
  });


  // When the signup button is clicked, we validate the email and password are not blank
  saveFavs.on("submit", function(event) {
    event.preventDefault();
    var itemStorageData = {
      name : $("#nameInput").val().trim(),
      price: $("#priceInput").val().trim(),
      href: $("#hrefInput").val().trim(),
      interests: $("#interestsInput").val().trim()
    };

    if (!itemStorageData.name)  {
      return;
    }

    // If we have an email and password, run the signUpUser function
    saveFavGift(itemStorageData.name, itemStorageData.price, itemStorageData.href, itemStorageData.interests);
    $("#nameInput").val("");
    $("#hrefInput").val("");
    $("#priceInput").val("");
    $("#interestsInput").val("");

  });


  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function saveFavGift(name, price, href, interests) {
    console.log("function saveFavGift called");
    $.post("/api/saveFavGift", {
      name: name,
      price: price,
      href: href,
      interests: interests
    })
      .then(function(data) {
        console.log("addedFavGift", data);
        $("#alert .msg").text("Favourite Gift Added to Database Successfully!");
        window.location.replace("/saveFavs.html");
      })
      .catch(handleLoginErr);
  }
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});