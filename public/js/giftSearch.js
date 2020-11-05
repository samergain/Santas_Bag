$(document).ready(function () {
    // Getting references to our form and input
    var searchGift = $("form.searchGift");
  
    var url = window.location.search;
    var userCircleId;
    if (url.indexOf("?id=") !== -1) {
      userCircleId = url.split("=")[1];
      console.log("giftSearch file - userCircleId #1: ", userCircleId);
      getPerson(userCircleId);
    }
  
    function getPerson(userCircleId) {
      $.get("/api/getOnePerson/" + userCircleId, function (data) {
        console.log("SelectedPerson", data);
        if (data.length !== 0) {
          $("#id").text(data[0].id);
          $("#name").text(data[0].name);
          $("#age").text(data[0].age);
          $("#budget").text(data[0].budget);
          $("#interests").text(data[0].keywords);
        }
        matchInterest(data[0].budget, data[0].keywords);
      });
    }
  
    function matchInterest(budget, keywords) {
      console.log("within Match interest function: " + "budget: " + budget + "keyword: " + keywords);
      $.get("/api/matchInterest/" + budget + "/" + keywords, function (data) {
        console.log("Match results in giftSearch: ", data);
  
        if (data.length !== 0) {
          var col = ["GIFT ID", "NAME", "CATEGORY", "PRICE", "HREF", "Choose One Gift"];
          var table = document.createElement("table");
          var tr = table.insertRow(-1);                   // TABLE ROW.
          for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
          }
          // ADD JSON DATA TO THE TABLE AS ROWS.
          for (var i = 0; i < data.length; i++) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i].id;
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i].name;
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i].category;
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i].price;
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = `<a href="${data[i].href}" target="_blank">URL</a>`;
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = "<button class='addGift' data-id='" + data[i].id + "'>CHOOSE GIFT</button>";
          }
  
          // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
          var divContainer = document.getElementById("matchResult");
          divContainer.innerHTML = "";
          divContainer.appendChild(table);
        }else{
          var para = document.createElement("p");
          para.innerHTML = "No Matching Criteria";
          var divContainer = document.getElementById("matchResult");
          divContainer.innerHTML = "";
          divContainer.style.color = "rgb(223, 56, 56)";
          divContainer.appendChild(para);
        }
  
        $(".addGift").click(function () {
          console.log("Add Gift to Person:", $(this).attr("data-id"));
          //window.location.replace("/giftSearch.html?id=" + $(this).attr("data-id"));
        });
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