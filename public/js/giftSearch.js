$(document).ready(function () {
  // Getting references to our form and input
  var searchGift = $("form.searchGift");
  // var userId;

  // $.get("/api/user_data").then(function(data) {
  //   email = data.email;
  //   userId = data.id;
  // });

  var url = window.location.search;
  var userCircleId;
  if (url.indexOf("?id=") !== -1) {
    userCircleId = url.split("=")[1];
    console.log("giftSearch file - userCircleId #1: ", userCircleId);
    getPerson(userCircleId);
  }
  // If there's no authorId we just get all posts as usual
  else {
    getPerson(userCircleId)
  }


function getPerson(userCircleId) {
  // userCircleId = userCircleId || "";
  // if (userCircleId) {
  //   userCircleId = "/?id=" + userCircleId;
  //   console.log("giftSearch file - userCircleId #2: ", userCircleId);
  // }
  $.get("/api/getOnePerson/" + userCircleId, function(data) {
    console.log("SelectedPerson", data);
    if (data.length !== 0) {
        $("#id").text(data[0].id);
        $("#name").text(data[0].name);
        $("#age").text(data[0].age);
        $("#budget").text(data[0].budget);
        $("#interests").text(data[0].keywords);
    }
  });
}
  

  // When the signup button is clicked, we validate the email and password are not blank
  searchGift.on("submit", function (event) {
    event.preventDefault();
    console.log("form submit working");
    var srchGift = {
      srchInput: $("#srchInput").val().trim()
    };

    if (!srchGift.srchInput) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    getGifts(srchGift.srchInput);
    $("#srchInput").val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function getGifts(srchGift) {
    console.log("function getGifts called");
    $.get("/api/giftSearch/" + srchGift, function (data) {
      console.log(data);
      renderGifts(data);
    });
  }

  function renderGifts(data) {
    if (data.length !== 0) {

      $("#srchedResult").empty();
      $("#srchedResult").show();

      for (var i = 0; i < data.length; i++) {

        var div = $("<div>");

        div.append("<h2>" + data[i].title + "</h2>");
        div.append("<p>Name: " + data[i].name + "</p>");
        div.append("<p>Category: " + data[i].category + "</p>");
        div.append("<p>Price: " + data[i].price + "</p>");
        div.append("<p>URL Link: " + data[i].href + "</p>");
        div.append("<button class='select' data-id='" + data[i].id + "'>SELECT GIFT</button>");

        $("#srchedResult").append(div);

      }

      // $(".select").click(function() {

      //   $.ajax({
      //     method: "UPDATE",
      //     url: "/api/personGift/" + $(this).attr("data-id")
      //   })
      //     // On success, run the following code
      //     .then(function() {
      //       console.log("Gift Added Successfully!");
      //     });

      //   //$(this).closest("div").remove();

      // });

    }
  }


  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
