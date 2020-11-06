$(document).ready(function () {
  // Getting references to our form and input
  var userId;
  
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    userId = data.id;
    findPersons(userId);
    // $(".hiddenId").text(data.id);
  });

  findPersons(userId);

  //As soon as the user is logged in, they will be taken to this page to view their summary of the gift Persons added so far and theird details
  //Client-side API route to get all persons for a particular User
  function findPersons(userId) {
    $.get("/api/getAllPersons/" + userId, function (data) {
      renderGiftPersons(data);
    });
  }

  //ASYNC function that renders the gift Person(s) Data dynamically on the page
  async function renderGiftPersons(data) {
    let totalPrice;
    let totalgiftCount;
    let totalGiftBudget=0;

    if (data.length !== 0) {
      $("#stats").empty();
      $("#stats").show();

      for (var i = 0; i < data.length; i++) {
        await getTotalCost(data[i].id);
        totalGiftBudget += parseInt(totalPrice);  //calculate the total budget for the logged in User
      
        $('#totalBudget').text(totalGiftBudget);
        var div = $("<div>");

        div.append("<h5>" + data[i].name + "</h5>");
        div.append("<p>Age: " + data[i].age + "</p>");
        div.append("<p>Budget: " + data[i].budget + "</p>");
        div.append("<p>Interests: " + data[i].keywords + "</p>");
        div.append("<p>Total Gifts Selected: " + totalgiftCount + "</p>");
        div.append("<p class='totalPrice'>Total Expense: " + totalPrice + "</p>");
        div.append("<button class='delete btn btn-danger btn-lg green darken-3' data-id='" + data[i].id + "'><span class='fa fa-trash'></span> DELETE PERSON</button>");
        div.append("<span>      </span>");
        div.append("<button class='search btn btn-danger btn-lg green darken-3' data-id='" + data[i].id + "'><span class='fa fa-search'></span> SEARCH GIFT</button>");

        $("#stats").append(div);

        if (parseInt(totalPrice) > data[i].budget){
          $(".totalPrice").addClass( "overBudget" );
          $(".totalPrice").removeClass( "underBudget" );
        } else{
          $(".totalPrice").addClass( "underBudget" );
          $(".totalPrice").removeClass( "overBudget" );
        }

      }

      //function that calculates the total cost for each gift-Person and number of gifts,  by a ajax call to Sequelize DB
      function getTotalCost(id){
        return $.ajax({
          method: "GET",
          url: "/api/getTotalCost/" + id
        })
          .then(function (results) {
            if (results.length !== 0) {
              totalPrice = results[0].total_amount;
              totalgiftCount = results[0].total_gifts;
            } else {
              totalPrice = 0;
              totalgiftCount = 0;
            }
            return results;
          }).catch(function(err){
            console.log("Error on getTotalCost request in viewPerson.js:" , err);
          });
    
      }
      //delete Gift Person
      $(".delete").click(function () {
        $.ajax({
          method: "DELETE",
          url: "/api/delPerson/" + $(this).attr("data-id") + "/" + userId
        })
          .then(function (response) {
            window.location.replace("/viewPerson");
          }).catch(function(err){
            console.log("Error on DELETE: ", err);
            alert("Unauthorized Delete! You may have Gifts assocaited with this User.");
          });

        //$(this).closest("div").remove();
      });

      //Search Button Click Event that takes to the Search Gift Page
      $(".search").click(function () {
        window.location.replace("/giftSearch.html?id=" + $(this).attr("data-id"));
      });

    }
  }
 

});
