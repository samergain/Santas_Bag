$(document).ready(function() {
  // Getting references to our form and input
  var userId;
  var emailInput = $("input#email-input");

  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;
    findPersons(userId);
    $(".hiddenId").text(data.id);
  });

  findPersons(userId);
  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function findPersons(userId) {
    console.log("function findPersons called for userId: ", userId);
    $.get("/api/getAllPersons/" + userId, function(data){
      console.log(data);
      renderGiftPersons(data);
    });
  }

  function renderGiftPersons(data) {
 
    if (data.length !== 0) {
  
      $("#stats").empty();
      $("#stats").show();
  
      for (var i = 0; i < data.length; i++) {
  
        var div = $("<div>");
  
        div.append("<h5>" + data[i].name + "</h5>");
        div.append("<p>Id: " + data[i].id + "</p>");
        div.append("<p>Age: " + data[i].age + "</p>");
        div.append("<p>Budget: " + data[i].budget + "</p>");
        div.append("<p>Interests: " + data[i].keywords + "</p>");
        div.append("<button class='delete' data-id='" + data[i].id + "'>DELETE PERSON</button>");
        div.append("<button class='search' data-id='" + data[i].id + "'>SEARCH GIFT</button>");
  
        $("#stats").append(div);
  
      }
  
      $(".delete").click(function() {
  
        $.ajax({
          method: "UPDATE",
          url: "/api/personGift/" + $(this).attr("data-id")
        })
          // On success, run the following code
          .then(function() {
            console.log("Gift Added Successfully!");
          });
  
        $(this).closest("div").remove();
  
      });

      $(".search").click(function() {
        $.ajax({
          method: "GET",
          url: "/api/getOnePerson/" + $(this).attr("data-id")
        })
          // On success, run the following code
          .then(function(data) {
            console.log("One Person Info pulled Successfully!");
            storeUserDataInSession(data);
            window.location.replace("/giftSearch");
          });
      });

      function storeUserDataInSession(data) {
        //var userObjectString = JSON.stringify(userData);
        window.sessionStorage.setItem('userObject',data);
    }   
      // function renderOnePerson(data){
      //   if (data.length !== 0) {
      //     $("#id").text(data[0].id);
      //     $("#name").text(data[0].name);
      //     $("#age").text(data[0].age);
      //     $("#budget").text(data[0].budget);
      //     $("#interests").text(data[0].keywords);
      //   }
      // }
  
    }
  }

});
