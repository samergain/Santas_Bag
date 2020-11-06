$(document).ready(function () {
  // Getting references to our form and input
  var userId;
  
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    userId = data.id;
    findPersons(userId);
    $(".hiddenId").text(data.id);
  });

  findPersons(userId);
  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function findPersons(userId) {
    $.get("/api/getAllPersons/" + userId, function (data) {
      renderGiftPersons(data);
    });
  }

  async function renderGiftPersons(data) {

    let totalPrice;
    let totalgiftCount;
    let totalGiftBudget=0;

    if (data.length !== 0) {
      $("#stats").empty();
      $("#stats").show();

      for (var i = 0; i < data.length; i++) {

        let totalInfoByPerson = await getTotalCost(data[i].id);

        totalGiftBudget += parseInt(totalPrice);
        
        // $('#totalBudget').innerHTML(totalGiftBudget);
        // $('#totalBudget').val(totalGiftBudget);
        $('#totalBudget').text(totalGiftBudget);
        var div = $("<div>");

        div.append("<h5>" + data[i].name + "</h5>");
        // div.append("<p>Id: " + data[i].id + "</p>");
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

      function getTotalCost(id){
        return $.ajax({
          method: "GET",
          url: "/api/getTotalCost/" + id
        })
          // On success, run the following code
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

      $(".delete").click(function () {
        $.ajax({
          method: "DELETE",
          url: "/api/delPerson/" + $(this).attr("data-id") + "/" + userId
        })
          // On success, run the following code
          .then(function (response) {
            window.location.replace("/viewPerson");
          }).catch(function(err){
            console.log("Error on DELETE: ", err);
            alert("Unauthorized Delete! You may have Gifts assocaited with this User.");
          });

        //$(this).closest("div").remove();
      });


      $(".search").click(function () {
        window.location.replace("/giftSearch.html?id=" + $(this).attr("data-id"));
      });


    }
  }

  

});
