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
    console.log("function findPersons called for userId: ", userId);
    $.get("/api/getAllPersons/" + userId, function (data) {
      console.log(data);
      renderGiftPersons(data);
    });
  }

  function renderGiftPersons(data) {

    let totalPrice;
    let totalgiftCount;

    if (data.length !== 0) {
      $("#stats").empty();
      $("#stats").show();

      for (var i = 0; i < data.length; i++) {

        $.get("/api/getTotalCost/" + data[i].id, function (results) {
          console.log(results);
          totalPrice = results.total_amount;
          totalgiftCount = results.total_gifts;
        });

        var div = $("<div>");

        div.append("<h5>" + data[i].name + "</h5>");
        div.append("<p>Id: " + data[i].id + "</p>");
        div.append("<p>Age: " + data[i].age + "</p>");
        div.append("<p>Budget: " + data[i].budget + "</p>");
        div.append("<p>Interests: " + data[i].keywords + "</p>");
        div.append("<b><p>Gift Info, if any...</p></b>");
        div.append("<p>Total Gifts Selected: " + totalgiftCount + "</p>");
        div.append("<p>Total Expense: " + totalPrice + "</p>");
        div.append("<button class='delete btn btn-danger btn-lg green darken-3' data-id='" + data[i].id + "'><span class='fa fa-trash'></span> DELETE PERSON</button>");
        div.append("<span>      </span>");
        div.append("<button class='search btn btn-danger btn-lg green darken-3' data-id='" + data[i].id + "'><span class='fa fa-search'></span> SEARCH GIFT</button>");

        $("#stats").append(div);

      }

      $(".delete").click(function () {
        $.ajax({
          method: "DELETE",
          url: "/api/delPerson/" + $(this).attr("data-id") + "/" + userId
        })
          // On success, run the following code
          .then(function (response) {
            console.log("delete respons: ", response);
            window.location.replace("/viewPerson");
          }).catch(function(err){
            console.log("Error on DELETE: ", err);
            alert("Unauthorized Delete! You may have Gifts assocaited with this User.");
          });

        //$(this).closest("div").remove();
      });


      $(".search").click(function () {
        console.log("Print GiftPerson ID:", $(this).attr("data-id"));
        window.location.replace("/giftSearch.html?id=" + $(this).attr("data-id"));
      });


    }
  }



});
