$(document).ready(function () {
  // Getting references to our form and input
  var searchGift = $("form.searchGift");
  // var userId;

  // $.get("/api/user_data").then(function(data) {
  //   email = data.email;
  //   userId = data.id;
  // });
loadOnePersonInfo();

function loadOnePersonInfo(){
  var data = {
    getUserDataFromSession: function () {
      var userData = window.sessionStorage.getItem('userObject');
      var stringgify = JSON.stringify(userData);
      console.log(userData);
      // return JSON.parse(userData);
      return userData;
    }
  }
  var userDataObject = data.getUserDataFromSession();
  console.log("userDataSession : ", userDataObject);
  console.log("userDataSession.userData[0] : ", userDataObject.UserData[0]);
  console.log("userDataSession.userData[0].id : ", userDataObject.UserData[0].id);

  // for (i = 0; i < userDataObject.UserData.length; i++) {
    $("#id").text(userDataObject.UserData[0].id);
        $("#name").text(userDataObject.UserData[0].name);
        $("#age").text(userDataObject.UserData[0].age);
        $("#budget").text(userDataObject.UserData[0].budget);
        $("#interests").text(userDataObject.UserData[0].keywords);
    // $('div').append('<p><span>' + userDataObject.UserData[i].Terms + ' : </span><span>' + userDataObject.UserData[i].Definitions + '</span></p>')
  // }
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
